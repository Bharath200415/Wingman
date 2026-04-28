#!/usr/bin/env python3
import re
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
from dateutil import parser as dateutil_parser
from dateutil.tz import gettz
from dateutil.parser._parser import UnknownTimezoneWarning
import numpy as np
import os
from matplotlib import font_manager as fm

try:
    import emoji
except ImportError:
    emoji = None

sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)
EMOJI_FONT = fm.FontProperties(family=["Segoe UI Emoji", "Noto Color Emoji", "Apple Color Emoji", "DejaVu Sans"])


class WhatsAppAnalyzer:
    def __init__(self, filepath, output_dir='output'):
        self.filepath = filepath
        self.messages = []
        self.df = None
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def parse_chat(self):
        #handling both 24hr and 12hr timestamps
        timestamp_re = re.compile(
            r"^\[?(?P<ts>\d{1,4}[\-/]\d{1,2}[\-/]\d{1,4}(?:,?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)?)\]?\s*[-–]\s*(?:(?P<sender>[^:]+?):\s*)?(?P<msg>.*)"
        )

        # suppress UnknownTimezoneWarning from dateutil and provide tz resolver
        warnings.filterwarnings("ignore", category=UnknownTimezoneWarning)
        tzinfos = lambda name: gettz(name) or None

        with open(self.filepath, 'r', encoding='utf-8', errors='replace') as file:
            lines = file.readlines()

        current = None
        matched = 0
        for raw in lines:
            line = raw.replace('\u202f', ' ').replace('\xa0', ' ').rstrip('\n')
            m = timestamp_re.match(line.strip())
            if m:
                # start of a new message
                if current:
                    self.messages.append(current)
                ts_str = m.group('ts').strip('[]').strip()
                sender = m.group('sender').strip() if m.group('sender') else 'System'
                msg = m.group('msg').strip()


                SYSTEM_PHRASES = [
                    "added",
                    "removed",
                    "left",
                    "joined using this group's invite link",
                    "changed the subject",
                    "changed this group's icon",
                    "deleted this message",
                    "messages and calls are end-to-end encrypted",
                    "security code changed"
                ]

                # Skip system sender messages
                if sender.lower() == "system":
                    continue

                # Skip whatsapp auto-generated system notifications
                if any(
                    phrase in msg.lower()
                    for phrase in SYSTEM_PHRASES
                ):
                    continue


                timestamp = None
                # try a list of timestamp formats
                for fmt in ['%m/%d/%y, %I:%M %p', '%m/%d/%Y, %I:%M %p', '%d/%m/%Y, %H:%M',
                            '%d/%m/%y, %H:%M', '%m/%d/%y, %H:%M', '%Y-%m-%d, %H:%M:%S',
                            '%Y-%m-%d, %H:%M', '%d/%m/%Y, %I:%M %p', '%m/%d/%Y, %H:%M:%S',
                            '%d/%m/%y, %I:%M %p', '%m/%d/%y, %I:%M%p', '%d/%m/%y, %I:%M%p',
                            '%m/%d/%Y, %I:%M%p', '%d/%m/%Y, %I:%M%p']:
                    try:
                        timestamp = datetime.strptime(ts_str, fmt)
                        break
                    except Exception:
                        continue
                current = {'timestamp': timestamp, 'sender': sender, 'message': msg}
                if timestamp is not None:
                    matched += 1
            else:
                # continuation of previous message
                if current:
                    # append with newline to preserve structure
                    current['message'] = (current.get('message', '') + '\n' + line).strip()

        if current:
            self.messages.append(current)

        if not self.messages or all(m.get('timestamp') is None for m in self.messages):
            # fallback: try permissive scan using dateutil to detect timestamps anywhere at line start
            fallback_matches = 0
            self.messages = []
            for raw in lines:
                line = raw.strip()
                if not line:
                    continue
                # try to parse a leading date/time token from the start of the line
                front = line[:80]
                try:
                    dt = dateutil_parser.parse(front, fuzzy=True, default=datetime(1970, 1, 1), tzinfos=tzinfos)
                    # ensure parsed token is near start by checking stringified year/month/day present
                    # accept if year parsed reasonably
                    if dt.year >= 1970 and dt.year <= 2100:
                        # remainder after the parsed token
                        # find the first occurrence of '-' or ':' after the parsed date
                        # attempt to split sender and message
                        remainder = line
                        # try common separators
                        sep_idx = None
                        for sep in [' - ', ' – ', '- ', ' –', '\t']:
                            if sep in remainder:
                                sep_idx = remainder.find(sep)
                                break
                        if sep_idx is not None:
                            after = remainder[sep_idx + len(sep):]
                        else:
                            # try to remove the parsed date text from the start
                            after = remainder
                        sender = 'unknown'
                        message = after
                        if ':' in after:
                            parts = after.split(':', 1)
                            sender = parts[0].strip()
                            message = parts[1].strip()
                        self.messages.append({'timestamp': dt, 'sender': sender, 'message': message})
                        fallback_matches += 1
                except Exception:
                    continue

            if fallback_matches == 0:
                # provide more context for debugging
                raise ValueError(f"No messages found or timestamps unrecognized. Lines scanned: {len(lines)}. Matches found: {matched}. Fallback matches: {fallback_matches}. Ensure export is 'Without Media' and timestamps are in a supported format.")

        self.df = pd.DataFrame(self.messages)
        # drop rows without parsed timestamp
        self.df = self.df[self.df['timestamp'].notnull()].copy()
        if self.df.empty:
            raise ValueError("Parsed messages found but no valid timestamps could be parsed.")
        self.df = self.df.sort_values('timestamp').reset_index(drop=True)

    def calculate_response_times(self):
        response_times = []
        for i in range(1, len(self.df)):
            prev_sender = self.df.iloc[i-1]['sender']
            curr_sender = self.df.iloc[i]['sender']
            if prev_sender != curr_sender:
                time_diff = (self.df.iloc[i]['timestamp'] - self.df.iloc[i-1]['timestamp']).total_seconds() / 60
                if 0 < time_diff < 1440:
                    response_times.append({'responder': curr_sender, 'response_time_minutes': time_diff})
        return pd.DataFrame(response_times)

    def plot_response_time_percentiles(self):
        rt_df = self.calculate_response_times()
        if rt_df.empty:
            return
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        percentiles = [50, 90, 95, 99]
        values = [np.percentile(rt_df['response_time_minutes'], p) for p in percentiles]
        colors = ['#2ecc71', '#f39c12', '#e74c3c', '#c0392b']
        bars = ax1.bar([f'P{p}' for p in percentiles], values, color=colors, alpha=0.7)
        ax1.set_ylabel('Response Time (minutes)')
        ax1.set_title('Response Time Percentiles', fontsize=14, fontweight='bold')
        ax1.grid(axis='y', alpha=0.3)
        for bar, val in zip(bars, values):
            ax1.text(bar.get_x() + bar.get_width()/2., bar.get_height(), f'{val:.1f}m', ha='center', va='bottom', fontsize=10, fontweight='bold')
        for sender in rt_df['responder'].unique():
            sender_data = rt_df[rt_df['responder'] == sender]['response_time_minutes']
            if len(sender_data) > 5:
                ax2.scatter(np.percentile(sender_data, 50), np.percentile(sender_data, 90), s=200, alpha=0.6, label=sender[:20])
        ax2.set_xlabel('P50 Response Time (minutes)')
        ax2.set_ylabel('P90 Response Time (minutes)')
        ax2.set_title('Response Time by Person', fontsize=14, fontweight='bold')
        ax2.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
        ax2.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, '01_response_time_percentiles.png'), dpi=150, bbox_inches='tight')
        plt.close()

    def plot_response_time_heatmap(self):
        rt_df = self.calculate_response_times()
        if rt_df.empty:
            return
        rt_df = rt_df.join(self.df[['timestamp']].iloc[1:].reset_index(drop=True))
        rt_df['hour'] = rt_df['timestamp'].dt.hour
        rt_df['day_of_week'] = rt_df['timestamp'].dt.dayofweek
        heatmap_data = rt_df.groupby(['day_of_week', 'hour'])['response_time_minutes'].median().unstack(fill_value=0)
        plt.figure(figsize=(14, 6))
        sns.heatmap(heatmap_data, cmap='RdYlGn_r', annot=False, cbar_kws={'label': 'Median Response Time (minutes)'})
        plt.xlabel('Hour of Day')
        plt.ylabel('Day of Week')
        plt.yticks([0.5,1.5,2.5,3.5,4.5,5.5,6.5], ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], rotation=0)
        plt.title('Response Time Heatmap: When Are They Fastest?', fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, '02_response_time_heatmap.png'), dpi=150, bbox_inches='tight')
        plt.close()

    def plot_message_volume(self):
        message_counts = self.df['sender'].value_counts()
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        colors = plt.cm.Set3(range(len(message_counts)))
        bars = ax1.barh(range(len(message_counts)), message_counts.values, color=colors)
        ax1.set_yticks(range(len(message_counts)))
        ax1.set_yticklabels([name[:30] for name in message_counts.index])
        ax1.set_xlabel('Number of Messages')
        ax1.set_title('Who Talks More?', fontsize=14, fontweight='bold')
        ax1.grid(axis='x', alpha=0.3)
        total = message_counts.sum()
        for i, (bar, count) in enumerate(zip(bars, message_counts.values)):
            pct = (count / total) * 100
            ax1.text(count, i, f' {count} ({pct:.1f}%)', va='center', fontsize=9)
        ax2.pie(message_counts.values, labels=[name[:20] for name in message_counts.index], autopct='%1.1f%%', colors=colors, startangle=90)
        ax2.set_title('Message Share', fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, '03_message_volume.png'), dpi=150, bbox_inches='tight')
        plt.close()

    def plot_activity_patterns(self):
        self.df['hour'] = self.df['timestamp'].dt.hour
        self.df['day_of_week'] = self.df['timestamp'].dt.dayofweek
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10))
        hourly = self.df.groupby('hour').size()
        ax1.bar(hourly.index, hourly.values, color='#3498db', alpha=0.7)
        ax1.set_xlabel('Hour of Day')
        ax1.set_ylabel('Number of Messages')
        ax1.set_title('Most Active Hours', fontsize=14, fontweight='bold')
        ax1.set_xticks(range(24))
        ax1.grid(axis='y', alpha=0.3)
        late_night_mask = (hourly.index >= 0) & (hourly.index < 6)
        ax1.bar(hourly.index[late_night_mask], hourly.values[late_night_mask], color='#e74c3c', alpha=0.7, label='Late Night Activity')
        ax1.legend()
        daily = self.df.groupby('day_of_week').size()
        days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
        colors_day = ['#3498db']*5 + ['#2ecc71']*2
        ax2.bar(range(7), daily.values, color=colors_day, alpha=0.7)
        ax2.set_xlabel('Day of Week')
        ax2.set_ylabel('Number of Messages')
        ax2.set_title('Weekend Warrior vs Weekday Ghost', fontsize=14, fontweight='bold')
        ax2.set_xticks(range(7))
        ax2.set_xticklabels(days)
        ax2.grid(axis='y', alpha=0.3)
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, '04_activity_patterns.png'), dpi=150, bbox_inches='tight')
        plt.close()

    def plot_conversation_initiators(self):
        self.df['time_gap'] = self.df['timestamp'].diff().dt.total_seconds() / 3600
        conversation_starters = self.df[self.df['time_gap'] > 6]['sender'].value_counts()
        if conversation_starters.empty:
            return
        plt.figure(figsize=(10, 6))
        colors = plt.cm.Pastel1(range(len(conversation_starters)))
        bars = plt.bar(range(len(conversation_starters)), conversation_starters.values, color=colors)
        plt.xticks(range(len(conversation_starters)), [name[:20] for name in conversation_starters.index], rotation=45, ha='right')
        plt.ylabel('Number of Conversations Started')
        plt.title('Who Initiates Conversations More?', fontsize=14, fontweight='bold')
        plt.grid(axis='y', alpha=0.3)
        for bar, val in zip(bars, conversation_starters.values):
            plt.text(bar.get_x() + bar.get_width()/2., bar.get_height(), f'{val}', ha='center', va='bottom', fontsize=10, fontweight='bold')
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, '05_conversation_initiators.png'), dpi=150, bbox_inches='tight')
        plt.close()

    def plot_double_text_frequency(self):
        double_texts = []
        current_streak = 1
        current_sender = self.df.iloc[0]['sender']
        for i in range(1, len(self.df)):
            if self.df.iloc[i]['sender'] == current_sender:
                current_streak += 1
            else:
                if current_streak > 1:
                    double_texts.append({'sender': current_sender, 'streak': current_streak})
                current_sender = self.df.iloc[i]['sender']
                current_streak = 1
        if not double_texts:
            return
        dt_df = pd.DataFrame(double_texts)
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        freq = dt_df['sender'].value_counts()
        ax1.barh(range(len(freq)), freq.values, color='#e74c3c', alpha=0.7)
        ax1.set_yticks(range(len(freq)))
        ax1.set_yticklabels([name[:25] for name in freq.index])
        ax1.set_xlabel('Double Text Incidents')
        ax1.set_title('Double Text Frequency', fontsize=14, fontweight='bold')
        ax1.grid(axis='x', alpha=0.3)
        max_streaks = dt_df.groupby('sender')['streak'].max().sort_values(ascending=False)
        ax2.barh(range(len(max_streaks)), max_streaks.values, color='#9b59b6', alpha=0.7)
        ax2.set_yticks(range(len(max_streaks)))
        ax2.set_yticklabels([name[:25] for name in max_streaks.index])
        ax2.set_xlabel('Max Consecutive Messages')
        ax2.set_title('Longest Message Streak', fontsize=14, fontweight='bold')
        ax2.grid(axis='x', alpha=0.3)
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, '06_double_text_frequency.png'), dpi=150, bbox_inches='tight')
        plt.close()

    def plot_message_length_analysis(self):
        self.df['message_length'] = self.df['message'].str.len()
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        for sender in self.df['sender'].unique():
            sender_data = self.df[self.df['sender'] == sender]['message_length']
            ax1.hist(sender_data, bins=50, alpha=0.5, label=sender[:20])
        ax1.set_xlabel('Message Length (characters)')
        ax1.set_ylabel('Frequency')
        ax1.set_title('Message Length Distribution', fontsize=14, fontweight='bold')
        ax1.legend()
        ax1.set_xlim(0, 500)
        ax1.grid(axis='y', alpha=0.3)
        avg_length = self.df.groupby('sender')['message_length'].mean().sort_values(ascending=False)
        colors = plt.cm.viridis(np.linspace(0, 1, len(avg_length)))
        bars = ax2.barh(range(len(avg_length)), avg_length.values, color=colors)
        ax2.set_yticks(range(len(avg_length)))
        ax2.set_yticklabels([name[:25] for name in avg_length.index])
        ax2.set_xlabel('Average Message Length (characters)')
        ax2.set_title('Paragraph Sender vs One-Word Responder', fontsize=14, fontweight='bold')
        ax2.grid(axis='x', alpha=0.3)
        for i, (bar, val) in enumerate(zip(bars, avg_length.values)):
            ax2.text(val, i, f' {val:.0f}', va='center', fontsize=9)
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, '07_message_length_analysis.png'), dpi=150, bbox_inches='tight')
        plt.close()

    def plot_emoji_analysis(self):
        emoji_data = []
        for _, row in self.df.iterrows():
            if emoji is not None:
                extracted = [item['emoji'] for item in emoji.emoji_list(row['message'])]
            else:
                import re as re2
                emoji_pattern = re2.compile("["
                    u"\U0001F600-\U0001F64F"
                    u"\U0001F300-\U0001F5FF"
                    u"\U0001F680-\U0001F6FF"
                    u"\U0001F1E0-\U0001F1FF"
                    u"\U00002702-\U000027B0"
                    u"\U000024C2-\U0001F251"
                    "]+", flags=re2.UNICODE)
                extracted = emoji_pattern.findall(row['message'])

            for emoji_char in extracted:
                emoji_data.append({'sender': row['sender'], 'emoji': emoji_char})
        if not emoji_data:
            return
        emoji_df = pd.DataFrame(emoji_data)
        senders = list(self.df['sender'].unique())[:3]
        fig, axes = plt.subplots(1, len(senders), figsize=(15, 5))
        if len(senders) == 1:
            axes = [axes]
        for idx, sender in enumerate(senders):
            sender_emojis = emoji_df[emoji_df['sender'] == sender]['emoji'].value_counts().head(10)
            if len(sender_emojis) > 0:
                axes[idx].barh(range(len(sender_emojis)), sender_emojis.values, color='#f39c12', alpha=0.7)
                axes[idx].set_yticks(range(len(sender_emojis)))
                axes[idx].set_yticklabels([f'{e} ({c})' for e, c in sender_emojis.items()])
                for label in axes[idx].get_yticklabels():
                    label.set_fontproperties(EMOJI_FONT)
                axes[idx].set_xlabel('Frequency')
                axes[idx].set_title(f'{sender[:20]} Top Emojis', fontsize=12, fontweight='bold')
                axes[idx].grid(axis='x', alpha=0.3)
                axes[idx].tick_params(axis='y', labelsize=10)
        for ax in axes:
            for label in ax.get_xticklabels() + ax.get_yticklabels():
                label.set_fontproperties(EMOJI_FONT)
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, '08_emoji_analysis.png'), dpi=150, bbox_inches='tight')
        plt.close()

    def plot_question_frequency(self):
        self.df['has_question'] = self.df['message'].str.contains(r'\?')
        question_counts = self.df[self.df['has_question']].groupby('sender').size()
        total_messages = self.df.groupby('sender').size()
        question_rate = (question_counts / total_messages * 100).sort_values(ascending=False)
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        colors = plt.cm.Set2(range(len(question_counts)))
        ax1.bar(range(len(question_counts)), question_counts.values, color=colors, alpha=0.7)
        ax1.set_xticks(range(len(question_counts)))
        ax1.set_xticklabels([name[:15] for name in question_counts.index], rotation=45, ha='right')
        ax1.set_ylabel('Number of Questions')
        ax1.set_title('Who Asks More Questions?', fontsize=14, fontweight='bold')
        ax1.grid(axis='y', alpha=0.3)
        ax2.bar(range(len(question_rate)), question_rate.values, color=colors, alpha=0.7)
        ax2.set_xticks(range(len(question_rate)))
        ax2.set_xticklabels([name[:15] for name in question_rate.index], rotation=45, ha='right')
        ax2.set_ylabel('Question Rate (%)')
        ax2.set_title('Questions as % of Messages', fontsize=14, fontweight='bold')
        ax2.grid(axis='y', alpha=0.3)
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, '09_question_frequency.png'), dpi=150, bbox_inches='tight')
        plt.close()

    def plot_conversation_gaps(self):
        self.df['time_gap'] = self.df['timestamp'].diff()
        top_gaps = self.df.nlargest(10, 'time_gap')[['timestamp', 'time_gap', 'sender']]
        plt.figure(figsize=(12, 6))
        gap_hours = top_gaps['time_gap'].dt.total_seconds() / 3600
        colors = plt.cm.Reds(np.linspace(0.4, 0.9, len(gap_hours)))
        bars = plt.barh(range(len(gap_hours)), gap_hours, color=colors)
        plt.yticks(range(len(gap_hours)),
                   [f"{row['timestamp'].strftime('%Y-%m-%d')} ({row['sender'][:15]})" for _, row in top_gaps.iterrows()])
        plt.xlabel('Gap Duration (hours)')
        plt.title('Longest Conversation Gaps', fontsize=14, fontweight='bold')
        plt.grid(axis='x', alpha=0.3)
        for i, (bar, val) in enumerate(zip(bars, gap_hours)):
            days = val / 24
            label = f'{days:.1f}d' if days >= 1 else f'{val:.1f}h'
            plt.text(val, i, f' {label}', va='center', fontsize=9)
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, '10_conversation_gaps.png'), dpi=150, bbox_inches='tight')
        plt.close()

    def plot_daily_streak(self):
        daily_counts = self.df.groupby(self.df['timestamp'].dt.date).size()
        dates = pd.date_range(daily_counts.index.min(), daily_counts.index.max())
        daily_series = daily_counts.reindex(dates, fill_value=0)
        current_streak = 0
        max_streak = 0
        for count in daily_series:
            if count > 0:
                current_streak += 1
                max_streak = max(max_streak, current_streak)
            else:
                current_streak = 0
        plt.figure(figsize=(14, 6))
        plt.plot(daily_series.index, daily_series.values, linewidth=2, color='#3498db')
        plt.fill_between(daily_series.index, daily_series.values, alpha=0.3, color='#3498db')
        plt.xlabel('Date')
        plt.ylabel('Messages per Day')
        plt.title(f'Daily Message Activity (Longest Streak: {max_streak} days)', fontsize=14, fontweight='bold')
        plt.xticks(rotation=45, ha='right')
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, '11_daily_streak.png'), dpi=150, bbox_inches='tight')
        plt.close()

    def generate_summary_stats(self):
        rt_df = self.calculate_response_times()
        stats = {
            'Total Messages': len(self.df),
            'Participants': len(self.df['sender'].unique()),
            'Date Range': f"{self.df['timestamp'].min().date()} to {self.df['timestamp'].max().date()}",
            'Days Active': (self.df['timestamp'].max() - self.df['timestamp'].min()).days,
            'Avg Messages/Day': f"{len(self.df) / max((self.df['timestamp'].max() - self.df['timestamp'].min()).days, 1):.1f}",
            'P50 Response Time': f"{np.percentile(rt_df['response_time_minutes'], 50):.1f} min" if not rt_df.empty else 'N/A',
            'P90 Response Time': f"{np.percentile(rt_df['response_time_minutes'], 90):.1f} min" if not rt_df.empty else 'N/A',
            'P99 Response Time': f"{np.percentile(rt_df['response_time_minutes'], 99):.1f} min" if not rt_df.empty else 'N/A',
        }
        fig, ax = plt.subplots(figsize=(10, 8))
        ax.axis('off')
        y_pos = 0.95
        ax.text(0.5, y_pos, "WhatsApp Chat Analytics Summary", ha='center', va='top', fontsize=20, fontweight='bold')
        y_pos -= 0.08
        ax.text(0.5, y_pos, "(Programmer Style Stats)", ha='center', va='top', fontsize=14, style='italic', color='gray')
        y_pos -= 0.1
        for key, value in stats.items():
            ax.text(0.25, y_pos, key + ':', ha='left', va='top', fontsize=12, fontweight='bold')
            ax.text(0.75, y_pos, str(value), ha='right', va='top', fontsize=12, color='#2c3e50')
            y_pos -= 0.08
        y_pos -= 0.05
        ax.text(0.5, y_pos, 'Top Contributors', ha='center', va='top', fontsize=14, fontweight='bold', color='#e74c3c')
        y_pos -= 0.08
        for sender, count in self.df['sender'].value_counts().head(3).items():
            pct = (count / len(self.df)) * 100
            ax.text(0.5, y_pos, f"{sender[:30]}: {count} msgs ({pct:.1f}%)", ha='center', va='top', fontsize=11)
            y_pos -= 0.06
        plt.tight_layout()
        plt.savefig(os.path.join(self.output_dir, '00_summary_stats.png'), dpi=150, bbox_inches='tight')
        plt.close()
        return stats

    def generate_ai_context(self):
        rt_df = self.calculate_response_times()

        sender_counts = self.df.groupby('sender').size().sort_values(ascending=False)
        sender_avg_len = self.df.groupby('sender')['message'].apply(lambda s: s.str.len().mean())
        sender_questions = self.df.assign(has_question=self.df['message'].str.contains(r'\?', na=False)).groupby('sender')['has_question'].sum()

        sender_stats = {}
        for sender, count in sender_counts.items():
            sender_stats[sender] = {
                'message_count': int(count),
                'messages': int(count),
                'pct_of_total': round((count / len(self.df)) * 100, 2),
                'share_pct': round((count / len(self.df)) * 100, 2),
                'avg_msg_length': round(float(sender_avg_len.get(sender, 0.0)), 2),
                'avg_message_length': round(float(sender_avg_len.get(sender, 0.0)), 2),
                'questions_sent': int(sender_questions.get(sender, 0)),
            }

        response_by_sender = {}
        if not rt_df.empty:
            for sender, series in rt_df.groupby('responder')['response_time_minutes']:
                values = series.dropna().values
                if len(values) == 0:
                    continue
                response_by_sender[sender] = {
                    'count': int(len(values)),
                    'p50': round(float(np.percentile(values, 50)), 2),
                    'p90': round(float(np.percentile(values, 90)), 2),
                    'p99': round(float(np.percentile(values, 99)), 2),
                    'p50_minutes': round(float(np.percentile(values, 50)), 2),
                    'p90_minutes': round(float(np.percentile(values, 90)), 2),
                    'p99_minutes': round(float(np.percentile(values, 99)), 2),
                }

        hourly_counts = self.df.groupby(self.df['timestamp'].dt.hour).size()
        hourly_counts = hourly_counts.reindex(range(24), fill_value=0)

        top_hours_overall = (
            hourly_counts.sort_values(ascending=False)
            .head(5)
            .items()
        )
        peak_hours = {
            'overall_top_hours': [
                {'hour': int(hour), 'messages': int(count)} for hour, count in top_hours_overall
            ],
            'by_sender_top_hours': {},
        }

        for sender, group in self.df.groupby('sender'):
            sender_hours = group.groupby(group['timestamp'].dt.hour).size().reindex(range(24), fill_value=0)
            top_sender_hours = sender_hours.sort_values(ascending=False).head(3).items()
            peak_hours['by_sender_top_hours'][sender] = [
                {'hour': int(hour), 'messages': int(count)} for hour, count in top_sender_hours
            ]

        return {
            'sender_stats': sender_stats,
            'response_by_sender': response_by_sender,
            'peak_hours': peak_hours,
        }

    def get_raw_messages(self):
        if self.df is None or self.df.empty:
            return []
        raw = self.df.copy()
        raw['timestamp'] = raw['timestamp'].dt.strftime('%Y-%m-%dT%H:%M:%S')
        return raw[['timestamp', 'sender', 'message']].to_dict(orient='records')