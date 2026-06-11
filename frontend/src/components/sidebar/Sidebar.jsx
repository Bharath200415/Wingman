import { useState } from "react";
import { C, Avatar } from "../ui.jsx";
import {ArchiveBulk, Clock1Bulk, ActivityBulk} from 'mx-icons'


const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: <ArchiveBulk size={20} color="currentColor" /> },
  { id: "response", label: "Response Times", icon: <Clock1Bulk size={21} color="currentColor" /> },
  { id: "activity", label: "Activity", icon: <ActivityBulk  size={20} color="currentColor"/>},
  { id: "patterns", label: "Patterns", icon: <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24">
              <title>grid-2</title>
              <g fill="none">
                <path d="M7 13C8.39998 13 9.10001 13.0001 9.63477 13.2725C10.1052 13.5121 10.4879 13.8948 10.7275 14.3652C10.9999 14.9 11 15.6 11 17V18C11 19.4 10.9999 20.1 10.7275 20.6348C10.4879 21.1052 10.1052 21.4879 9.63477 21.7275C9.10001 21.9999 8.39998 22 7 22H6C4.60002 22 3.89999 21.9999 3.36523 21.7275C2.89483 21.4879 2.51214 21.1052 2.27246 20.6348C2.00007 20.1 2 19.4 2 18V17C2 15.6 2.00007 14.9 2.27246 14.3652C2.51214 13.8948 2.89483 13.5121 3.36523 13.2725C3.89999 13.0001 4.60002 13 6 13H7ZM18 13C19.4 13 20.1 13.0001 20.6348 13.2725C21.1052 13.5121 21.4879 13.8948 21.7275 14.3652C21.9999 14.9 22 15.6 22 17V18C22 19.4 21.9999 20.1 21.7275 20.6348C21.4879 21.1052 21.1052 21.4879 20.6348 21.7275C20.1 21.9999 19.4 22 18 22H17C15.6 22 14.9 21.9999 14.3652 21.7275C13.8948 21.4879 13.5121 21.1052 13.2725 20.6348C13.0001 20.1 13 19.4 13 18V17C13 15.6 13.0001 14.9 13.2725 14.3652C13.5121 13.8948 13.8948 13.5121 14.3652 13.2725C14.9 13.0001 15.6 13 17 13H18ZM7 2C8.39998 2 9.10001 2.00007 9.63477 2.27246C10.1052 2.51214 10.4879 2.89483 10.7275 3.36523C10.9999 3.89999 11 4.60002 11 6V7C11 8.39998 10.9999 9.10001 10.7275 9.63477C10.4879 10.1052 10.1052 10.4879 9.63477 10.7275C9.10001 10.9999 8.39998 11 7 11H6C4.60002 11 3.89999 10.9999 3.36523 10.7275C2.89483 10.4879 2.51214 10.1052 2.27246 9.63477C2.00007 9.10001 2 8.39998 2 7V6C2 4.60002 2.00007 3.89999 2.27246 3.36523C2.51214 2.89483 2.89483 2.51214 3.36523 2.27246C3.89999 2.00007 4.60002 2 6 2H7ZM18 2C19.4 2 20.1 2.00007 20.6348 2.27246C21.1052 2.51214 21.4879 2.89483 21.7275 3.36523C21.9999 3.89999 22 4.60002 22 6V7C22 8.39998 21.9999 9.10001 21.7275 9.63477C21.4879 10.1052 21.1052 10.4879 20.6348 10.7275C20.1 10.9999 19.4 11 18 11H17C15.6 11 14.9 10.9999 14.3652 10.7275C13.8948 10.4879 13.5121 10.1052 13.2725 9.63477C13.0001 9.10001 13 8.39998 13 7V6C13 4.60002 13.0001 3.89999 13.2725 3.36523C13.5121 2.89483 13.8948 2.51214 14.3652 2.27246C14.9 2.00007 15.6 2 17 2H18Z" fill="url(#1752500502788-6236163_grid-2_existing_0_m3bjlqlh3)" data-glass="origin" mask="url(#1752500502788-6236163_grid-2_mask_nbrqki8fd)"></path>
                <path d="M7 13C8.39998 13 9.10001 13.0001 9.63477 13.2725C10.1052 13.5121 10.4879 13.8948 10.7275 14.3652C10.9999 14.9 11 15.6 11 17V18C11 19.4 10.9999 20.1 10.7275 20.6348C10.4879 21.1052 10.1052 21.4879 9.63477 21.7275C9.10001 21.9999 8.39998 22 7 22H6C4.60002 22 3.89999 21.9999 3.36523 21.7275C2.89483 21.4879 2.51214 21.1052 2.27246 20.6348C2.00007 20.1 2 19.4 2 18V17C2 15.6 2.00007 14.9 2.27246 14.3652C2.51214 13.8948 2.89483 13.5121 3.36523 13.2725C3.89999 13.0001 4.60002 13 6 13H7ZM18 13C19.4 13 20.1 13.0001 20.6348 13.2725C21.1052 13.5121 21.4879 13.8948 21.7275 14.3652C21.9999 14.9 22 15.6 22 17V18C22 19.4 21.9999 20.1 21.7275 20.6348C21.4879 21.1052 21.1052 21.4879 20.6348 21.7275C20.1 21.9999 19.4 22 18 22H17C15.6 22 14.9 21.9999 14.3652 21.7275C13.8948 21.4879 13.5121 21.1052 13.2725 20.6348C13.0001 20.1 13 19.4 13 18V17C13 15.6 13.0001 14.9 13.2725 14.3652C13.5121 13.8948 13.8948 13.5121 14.3652 13.2725C14.9 13.0001 15.6 13 17 13H18ZM7 2C8.39998 2 9.10001 2.00007 9.63477 2.27246C10.1052 2.51214 10.4879 2.89483 10.7275 3.36523C10.9999 3.89999 11 4.60002 11 6V7C11 8.39998 10.9999 9.10001 10.7275 9.63477C10.4879 10.1052 10.1052 10.4879 9.63477 10.7275C9.10001 10.9999 8.39998 11 7 11H6C4.60002 11 3.89999 10.9999 3.36523 10.7275C2.89483 10.4879 2.51214 10.1052 2.27246 9.63477C2.00007 9.10001 2 8.39998 2 7V6C2 4.60002 2.00007 3.89999 2.27246 3.36523C2.51214 2.89483 2.89483 2.51214 3.36523 2.27246C3.89999 2.00007 4.60002 2 6 2H7ZM18 2C19.4 2 20.1 2.00007 20.6348 2.27246C21.1052 2.51214 21.4879 2.89483 21.7275 3.36523C21.9999 3.89999 22 4.60002 22 6V7C22 8.39998 21.9999 9.10001 21.7275 9.63477C21.4879 10.1052 21.1052 10.4879 20.6348 10.7275C20.1 10.9999 19.4 11 18 11H17C15.6 11 14.9 10.9999 14.3652 10.7275C13.8948 10.4879 13.5121 10.1052 13.2725 9.63477C13.0001 9.10001 13 8.39998 13 7V6C13 4.60002 13.0001 3.89999 13.2725 3.36523C13.5121 2.89483 13.8948 2.51214 14.3652 2.27246C14.9 2.00007 15.6 2 17 2H18Z" fill="url(#1752500502788-6236163_grid-2_existing_0_m3bjlqlh3)" data-glass="clone" filter="url(#1752500502788-6236163_grid-2_filter_6el0tyw10)" clip-path="url(#1752500502788-6236163_grid-2_clipPath_sq6e7ztdz)"></path>
                <rect x="6" y="6" width="12" height="12" rx="3" fill="url(#1752500502788-6236163_grid-2_existing_1_jbut9baiw)" data-glass="blur"></rect>
                <path d="M13.2002 17.25V18H10.7998V17.25H13.2002ZM17.25 13.2002V10.7998C17.25 9.94745 17.2497 9.35322 17.2119 8.89062C17.1748 8.4368 17.1055 8.17602 17.0049 7.97852C16.7892 7.55515 16.4448 7.21083 16.0215 6.99512C15.824 6.89449 15.5632 6.82517 15.1094 6.78809C14.6468 6.75029 14.0525 6.75 13.2002 6.75H10.7998C9.94745 6.75 9.35322 6.75029 8.89062 6.78809C8.4368 6.82517 8.17602 6.89449 7.97852 6.99512C7.55515 7.21083 7.21083 7.55515 6.99512 7.97852C6.89449 8.17602 6.82517 8.4368 6.78809 8.89062C6.75029 9.35322 6.75 9.94745 6.75 10.7998V13.2002C6.75 14.0525 6.75029 14.6468 6.78809 15.1094C6.82517 15.5632 6.89449 15.824 6.99512 16.0215C7.21083 16.4448 7.55515 16.7892 7.97852 17.0049C8.17602 17.1055 8.4368 17.1748 8.89062 17.2119C9.35322 17.2497 9.94745 17.25 10.7998 17.25V18C9.11978 18 8.27941 17.9998 7.6377 17.6729C7.14381 17.4211 6.73057 17.0383 6.44238 16.5684L6.32715 16.3623C6.0819 15.881 6.02021 15.2877 6.00488 14.3125L6 13.2002V10.7998C6 9.22468 6.00007 8.38795 6.26953 7.76074L6.32715 7.6377C6.57888 7.14381 6.96166 6.73057 7.43164 6.44238L7.6377 6.32715C8.27941 6.00018 9.11978 6 10.7998 6H13.2002L14.3125 6.00488C15.2877 6.02021 15.881 6.0819 16.3623 6.32715C16.9265 6.61472 17.3853 7.07347 17.6729 7.6377C17.9998 8.27941 18 9.11978 18 10.7998V13.2002L17.9951 14.3125C17.9798 15.2877 17.9181 15.881 17.6729 16.3623L17.5576 16.5684C17.2694 17.0383 16.8562 17.4211 16.3623 17.6729L16.2393 17.7305C15.7793 17.9281 15.2066 17.9811 14.3125 17.9951L13.2002 18V17.25C14.0525 17.25 14.6468 17.2497 15.1094 17.2119C15.5632 17.1748 15.824 17.1055 16.0215 17.0049C16.4448 16.7892 16.7892 16.4448 17.0049 16.0215C17.1055 15.824 17.1748 15.5632 17.2119 15.1094C17.2497 14.6468 17.25 14.0525 17.25 13.2002Z" fill="url(#1752500502788-6236163_grid-2_existing_2_atabi0p61)"></path>
                <defs>
                  <linearGradient id="1752500502788-6236163_grid-2_existing_0_m3bjlqlh3" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#575757"></stop>
                    <stop offset="1" stop-color="#151515"></stop>
                  </linearGradient>
                  <linearGradient id="1752500502788-6236163_grid-2_existing_1_jbut9baiw" x1="12" y1="6" x2="12" y2="18" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#E3E3E5" stop-opacity=".6"></stop>
                    <stop offset="1" stop-color="#BBBBC0" stop-opacity=".6"></stop>
                  </linearGradient>
                  <linearGradient id="1752500502788-6236163_grid-2_existing_2_atabi0p61" x1="12" y1="6" x2="12" y2="12.949" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#fff"></stop>
                    <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
                  </linearGradient>
                  <filter id="1752500502788-6236163_grid-2_filter_6el0tyw10" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
                  </filter>
                  <clipPath id="1752500502788-6236163_grid-2_clipPath_sq6e7ztdz">
                    <rect x="6" y="6" width="12" height="12" rx="3" fill="url(#1752500502788-6236163_grid-2_existing_1_jbut9baiw)"></rect>
                  </clipPath>
                  <mask id="1752500502788-6236163_grid-2_mask_nbrqki8fd">
                    <rect width="100%" height="100%" fill="#FFF"></rect>
                    <rect x="6" y="6" width="12" height="12" rx="3" fill="#000"></rect>
                  </mask>
                </defs>
              </g>
            </svg> },
  { id: "ai", label: "AI Analyst", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <title>sparkle</title>
              <g fill="none">
                <path d="M13 9.00531C13.5522 9.00531 13.9999 9.45308 14 10.0053V12.0053H16C16.5522 12.0053 16.9999 12.4531 17 13.0053C16.9998 13.5574 16.5521 14.0053 16 14.0053H14V16.0053C13.9998 16.5574 13.5521 17.0053 13 17.0053C12.4479 17.0053 12.0002 16.5574 12 16.0053V14.0053H10C9.44791 14.0053 9.00025 13.5574 9 13.0053C9.00007 12.4531 9.4478 12.0054 10 12.0053H12V10.0053C12.0001 9.45311 12.4478 9.00536 13 9.00531ZM6.07031 1.34125C6.4044 0.499912 7.59575 0.499853 7.92969 1.34125L9.25 4.66937C9.26453 4.70571 9.29373 4.73396 9.33008 4.74847L12.6592 6.07074C13.5005 6.40477 13.5005 7.59509 12.6592 7.92914L9.33008 9.2514C9.29374 9.2659 9.26454 9.29419 9.25 9.33051L7.92969 12.6586C7.59575 13.5 6.4044 13.5 6.07031 12.6586L4.74902 9.33051C4.73446 9.29418 4.70531 9.26588 4.66895 9.2514L1.34082 7.92914C0.49956 7.59509 0.49956 6.40479 1.34082 6.07074L4.66895 4.74847C4.70533 4.73399 4.73447 4.70572 4.74902 4.66937L6.07031 1.34125Z" fill="url(#1752500502803-7613136_sparkle_existing_0_mj429roqu)" data-glass="origin" mask="url(#1752500502803-7613136_sparkle_mask_90yh9c2fr)"></path>
                <path d="M13 9.00531C13.5522 9.00531 13.9999 9.45308 14 10.0053V12.0053H16C16.5522 12.0053 16.9999 12.4531 17 13.0053C16.9998 13.5574 16.5521 14.0053 16 14.0053H14V16.0053C13.9998 16.5574 13.5521 17.0053 13 17.0053C12.4479 17.0053 12.0002 16.5574 12 16.0053V14.0053H10C9.44791 14.0053 9.00025 13.5574 9 13.0053C9.00007 12.4531 9.4478 12.0054 10 12.0053H12V10.0053C12.0001 9.45311 12.4478 9.00536 13 9.00531ZM6.07031 1.34125C6.4044 0.499912 7.59575 0.499853 7.92969 1.34125L9.25 4.66937C9.26453 4.70571 9.29373 4.73396 9.33008 4.74847L12.6592 6.07074C13.5005 6.40477 13.5005 7.59509 12.6592 7.92914L9.33008 9.2514C9.29374 9.2659 9.26454 9.29419 9.25 9.33051L7.92969 12.6586C7.59575 13.5 6.4044 13.5 6.07031 12.6586L4.74902 9.33051C4.73446 9.29418 4.70531 9.26588 4.66895 9.2514L1.34082 7.92914C0.49956 7.59509 0.49956 6.40479 1.34082 6.07074L4.66895 4.74847C4.70533 4.73399 4.73447 4.70572 4.74902 4.66937L6.07031 1.34125Z" fill="url(#1752500502803-7613136_sparkle_existing_0_mj429roqu)" data-glass="clone" filter="url(#1752500502803-7613136_sparkle_filter_alhgtlde0)" clip-path="url(#1752500502803-7613136_sparkle_clipPath_92n6igug9)"></path>
                <path d="M16.6562 9.21226L14.3939 3.51196C13.893 2.24987 12.1067 2.24971 11.6056 3.51172L9.34194 9.21226C9.31834 9.27153 9.27153 9.31834 9.21226 9.34194L3.51085 11.6059C2.24896 12.107 2.24896 13.893 3.51085 14.3941L9.21226 16.6581C9.27153 16.6817 9.31834 16.7285 9.34194 16.7877L11.6055 22.4883C12.1067 23.7503 13.8929 23.7501 14.3939 22.488L16.6562 16.7877C16.6799 16.7283 16.7273 16.6816 16.7868 16.6581L22.4888 14.3941C23.7507 13.8931 23.7507 12.1069 22.4888 11.6059L16.7868 9.34194C16.7273 9.3184 16.6799 9.27173 16.6562 9.21226Z" fill="url(#1752500502803-7613136_sparkle_existing_1_itr2rlc6a)" data-glass="blur"></path>
                <path d="M11.6054 3.51174C12.1064 2.24985 13.8924 2.24997 14.3934 3.51174L16.6561 9.21194C16.6798 9.27141 16.7275 9.31828 16.787 9.34182L22.4882 11.6055C23.7501 12.1065 23.7501 13.8935 22.4882 14.3946L16.787 16.6582L16.745 16.6797C16.7052 16.7056 16.6739 16.7433 16.6561 16.7881L14.3934 22.4883L14.3427 22.6026C13.8 23.7118 12.1987 23.712 11.6561 22.6026L11.6054 22.4883L9.34168 16.7881C9.31809 16.7288 9.27106 16.6818 9.2118 16.6582L3.51063 14.3946C2.24874 13.8935 2.24874 12.1066 3.51063 11.6055L9.2118 9.34182C9.27106 9.31822 9.31809 9.2712 9.34168 9.21194L11.6054 3.51174ZM13.6972 3.78909C13.4468 3.15817 12.5534 3.15751 12.3026 3.78811L10.0389 9.48928C9.95156 9.70875 9.78837 9.88881 9.58094 9.99709L9.48914 10.0391L3.78797 12.3028C3.15702 12.5533 3.15703 13.4467 3.78797 13.6973L9.48914 15.961C9.70861 16.0483 9.88867 16.2115 9.99695 16.419L10.0389 16.5108L12.3026 22.2119C12.5534 22.8425 13.4458 22.8419 13.6962 22.211L15.9589 16.5108L16.0018 16.418C16.1117 16.2083 16.293 16.047 16.5097 15.961L22.2118 13.6973C22.8428 13.4468 22.8428 12.5533 22.2118 12.3028L16.5097 10.0391V10.0381C16.2931 9.95206 16.1116 9.79167 16.0018 9.58205L15.9589 9.48928L13.6972 3.78909Z" fill="url(#1752500502803-7613136_sparkle_existing_2_7lj7nb2b2)"></path>
                <defs>
                  <linearGradient id="1752500502803-7613136_sparkle_existing_0_mj429roqu" x1="8.855" y1=".71" x2="8.855" y2="13.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#575757"></stop>
                    <stop offset="1" stop-color="#151515"></stop>
                  </linearGradient>
                  <linearGradient id="1752500502803-7613136_sparkle_existing_1_itr2rlc6a" x1="13" y1="0" x2="13" y2="26" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#E3E3E5" stop-opacity=".6"></stop>
                    <stop offset="1" stop-color="#BBBBC0" stop-opacity=".6"></stop>
                  </linearGradient>
                  <linearGradient id="1752500502803-7613136_sparkle_existing_2_7lj7nb2b2" x1="12.999" y1="2.565" x2="12.999" y2="13.5" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#fff"></stop>
                    <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
                  </linearGradient>
                  <filter id="1752500502803-7613136_sparkle_filter_alhgtlde0" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
                  </filter>
                  <clipPath id="1752500502803-7613136_sparkle_clipPath_92n6igug9">
                    <path d="M16.6562 9.21226L14.3939 3.51196C13.893 2.24987 12.1067 2.24971 11.6056 3.51172L9.34194 9.21226C9.31834 9.27153 9.27153 9.31834 9.21226 9.34194L3.51085 11.6059C2.24896 12.107 2.24896 13.893 3.51085 14.3941L9.21226 16.6581C9.27153 16.6817 9.31834 16.7285 9.34194 16.7877L11.6055 22.4883C12.1067 23.7503 13.8929 23.7501 14.3939 22.488L16.6562 16.7877C16.6799 16.7283 16.7273 16.6816 16.7868 16.6581L22.4888 14.3941C23.7507 13.8931 23.7507 12.1069 22.4888 11.6059L16.7868 9.34194C16.7273 9.3184 16.6799 9.27173 16.6562 9.21226Z" fill="url(#1752500502803-7613136_sparkle_existing_1_itr2rlc6a)"></path>
                  </clipPath>
                  <mask id="1752500502803-7613136_sparkle_mask_90yh9c2fr">
                    <rect width="100%" height="100%" fill="#FFF"></rect>
                    <path d="M16.6562 9.21226L14.3939 3.51196C13.893 2.24987 12.1067 2.24971 11.6056 3.51172L9.34194 9.21226C9.31834 9.27153 9.27153 9.31834 9.21226 9.34194L3.51085 11.6059C2.24896 12.107 2.24896 13.893 3.51085 14.3941L9.21226 16.6581C9.27153 16.6817 9.31834 16.7285 9.34194 16.7877L11.6055 22.4883C12.1067 23.7503 13.8929 23.7501 14.3939 22.488L16.6562 16.7877C16.6799 16.7283 16.7273 16.6816 16.7868 16.6581L22.4888 14.3941C23.7507 13.8931 23.7507 12.1069 22.4888 11.6059L16.7868 9.34194C16.7273 9.3184 16.6799 9.27173 16.6562 9.21226Z" fill="#000"></path>
                  </mask>
                </defs>
              </g>
            </svg>},
];

//Collapse toggle icon 
function CollapseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <line x1="6" y1="2.7" x2="6" y2="13.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function NavItem({ item, active, onClick, collapsed }) {
  return (
    <button
      onClick={() => onClick(item.id)}
      title={collapsed ? item.label : undefined}
      className="relative flex items-center gap-3 rounded-xl text-sm font-medium w-full transition-all duration-200 group hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
      style={{
        padding: collapsed ? "10px 0" : "10px 8px",
        justifyContent: collapsed ? "center" : "flex-start",
        background: active ? "var(--sidebar-accent)" : "transparent",
        color: active ? "var(--sidebar-accent-foreground)" : "var(--sidebar-foreground)",
        border: `1px solid ${active ? "var(--sidebar-border)" : "transparent"}`,
      }}
    >
      <span className="text-current transition-colors" style={{ fontSize: 15, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>

      {!collapsed && <span className="truncate text-current">{item.label}</span>}

      {!collapsed && item.id === "ai" && (
        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 font-mono bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400">
          AI
        </span>
      )}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <span
          className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium
                     opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border border-[var(--sidebar-border)] shadow-md"
        >
          {item.label}
          {item.id === "ai" && <span className="ml-1.5 text-emerald-500 dark:text-emerald-400">AI</span>}
        </span>
      )}
    </button>
  );
}

function ChatItem({ chat, active, onClick, onDelete, onRename, collapsed }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(chat.name);
  const commit = () => { onRename(chat.id, name); setEditing(false); };
  const initial = chat.data?.participants?.[0] ?? "?";

  if (collapsed) {
    return (
      <button
        onClick={() => onClick(chat.id)}
        title={chat.name}
        className="relative flex items-center justify-center w-full rounded-xl py-2 transition-all group hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
        style={{
          background: active ? "var(--sidebar-accent)" : "transparent",
          border: `1px solid ${active ? "var(--sidebar-border)" : "transparent"}`,
          color: active ? "var(--sidebar-accent-foreground)" : "var(--sidebar-foreground)",
        }}
      >
        <Avatar name={initial} size={24} />
        <span
          className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-lg font-medium
                     opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border border-[var(--sidebar-border)] shadow-md"
        >
          {chat.name}
        </span>
      </button>
    );
  }

  return (
    <div
      onClick={() => !editing && onClick(chat.id)}
      className="group flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer transition-all hover:bg-[var(--sidebar-accent)] text-[var(--sidebar-foreground)] hover:text-[var(--sidebar-accent-foreground)]"
      style={{
        background: active ? "var(--sidebar-accent)" : "transparent",
        border: `1px solid ${active ? "var(--sidebar-border)" : "transparent"}`,
      }}
    >
      <Avatar name={initial} size={24} />
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus value={name}
            onChange={e => setName(e.target.value)}
            onBlur={commit}
            onKeyDown={e => e.key === "Enter" && commit()}
            onClick={e => e.stopPropagation()}
            className="w-full bg-transparent text-xs outline-none"
            style={{ color: "var(--sidebar-foreground)", borderBottom: `1px solid var(--sidebar-primary)` }}
          />
        ) : (
          <p className="text-xs font-semibold truncate text-current">
            {chat.name}
          </p>
        )}
        <p className="text-[10px] truncate opacity-60 font-mono">
          {chat.data?.participants?.slice(0, 2).join(", ")}
        </p>
      </div>
      <div className="hidden group-hover:flex gap-1 flex-shrink-0">
        <button onClick={e => { e.stopPropagation(); setEditing(true); }}
          className="w-5 h-5 rounded flex items-center justify-center text-[10px] hover:brightness-110 active:scale-95 transition-all bg-[var(--sidebar-accent)] border border-[var(--sidebar-border)]"
          style={{ color: "var(--sidebar-foreground)" }} title="Rename">✎</button>
        <button onClick={e => { e.stopPropagation(); onDelete(chat.id); }}
          className="w-5 h-5 rounded flex items-center justify-center text-[10px] hover:brightness-110 active:scale-95 transition-all bg-rose-500/10 text-rose-500"
          title="Delete">✕</button>
      </div>
    </div>
  );
}

export default function Sidebar({
  chats, activeChat, activeNav,
  collapsed, onToggleCollapsed,
  onSelectChat, onSelectNav,
  onNewAnalysis, onDeleteChat, onRenameChat,
  currentParticipants,
}) {
  return (
    <aside
      className="flex flex-col flex-shrink-0 h-screen transition-all duration-300 ease-in-out overflow-hidden bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] text-[var(--sidebar-foreground)]"
      style={{
        width: collapsed ? 64 : 220,
      }}
    >
      {/* ── Header: Logo + collapse toggle ── */}
      <div
        className="flex items-center flex-shrink-0 px-4 py-3 border-b border-[var(--sidebar-border)]"
        style={{
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: 56,
        }}
      >
        {/* Logo — hidden when collapsed */}
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[11px] flex-shrink-0 text-neutral-950"
              style={{ fontFamily: "'Cabinet Grotesk',sans-serif" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <title>square-chart-line</title>
              <g fill="none">
                <path d="M3 8.4C3 6.15979 3 5.03968 3.43597 4.18404C3.81947 3.43139 4.43139 2.81947 5.18404 2.43597C6.03968 2 7.15979 2 9.4 2H14.6C16.8402 2 17.9603 2 18.816 2.43597C19.5686 2.81947 20.1805 3.43139 20.564 4.18404C21 5.03968 21 6.15979 21 8.4V11.6C21 13.8402 21 14.9603 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C17.9603 18 16.8402 18 14.6 18H9.4C7.15979 18 6.03968 18 5.18404 17.564C4.43139 17.1805 3.81947 16.5686 3.43597 15.816C3 14.9603 3 13.8402 3 11.6V8.4Z" fill="url(#1752500502804-9183447_square-chart-line_existing_0_ko3hky3pd)" data-glass="origin" mask="url(#1752500502804-9183447_square-chart-line_mask_66dhv0iub)"></path>
                <path d="M3 8.4C3 6.15979 3 5.03968 3.43597 4.18404C3.81947 3.43139 4.43139 2.81947 5.18404 2.43597C6.03968 2 7.15979 2 9.4 2H14.6C16.8402 2 17.9603 2 18.816 2.43597C19.5686 2.81947 20.1805 3.43139 20.564 4.18404C21 5.03968 21 6.15979 21 8.4V11.6C21 13.8402 21 14.9603 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C17.9603 18 16.8402 18 14.6 18H9.4C7.15979 18 6.03968 18 5.18404 17.564C4.43139 17.1805 3.81947 16.5686 3.43597 15.816C3 14.9603 3 13.8402 3 11.6V8.4Z" fill="url(#1752500502804-9183447_square-chart-line_existing_0_ko3hky3pd)" data-glass="clone" filter="url(#1752500502804-9183447_square-chart-line_filter_kwhh3qkup)" clip-path="url(#1752500502804-9183447_square-chart-line_clipPath_lvme5u893)"></path>
                <path d="M9.7666 9.87523C9.48873 9.39536 8.87716 9.21774 8.3916 9.48558L3.55455 12.1452C2.59573 12.6724 2 13.6798 2 14.774V16.5998V16.6031C2 18.8398 2 18.9605 2.43555 19.8157C2.81896 20.5681 3.43117 21.1802 4.18359 21.5637C5.03924 21.9997 6.16018 22.0002 8.40039 22.0002H15.5996C17.8398 22.0002 18.9608 21.9997 19.8164 21.5637C20.5688 21.1802 21.181 20.5681 21.5645 19.8157C22 18.9605 22 17.8408 22 15.6031V15.5998V10.6428C21.9999 9.89353 21.2089 9.41219 20.5488 9.76683C18.0694 11.099 14.7916 12.9434 13.2812 13.7971C12.8177 14.0591 12.2304 13.9141 11.9473 13.4631C11.3884 12.5728 10.4754 11.0997 9.7666 9.87523Z" fill="url(#1752500502804-9183447_square-chart-line_existing_1_vl0j8v33y)" data-glass="blur"></path>
                <path d="M15.5996 21.2502V22.0002H8.40039V21.2502H15.5996ZM21.25 15.6028V10.6428C21.2499 10.45 21.0543 10.3468 20.9033 10.428C18.4318 11.7559 15.1607 13.5968 13.6504 14.4504C12.8422 14.9072 11.8113 14.6562 11.3125 13.8616C10.7527 12.9697 9.83302 11.4877 9.11719 10.2512C9.03879 10.1159 8.87324 10.0762 8.75391 10.1418L8.75293 10.1428L3.91602 12.802C3.19701 13.1973 2.75013 13.9532 2.75 14.7737V15.6028C2.75 16.734 2.75039 17.5383 2.80176 18.1672C2.8524 18.7868 2.94873 19.1707 3.10352 19.4748C3.41499 20.0861 3.91297 20.5841 4.52441 20.8957C4.82888 21.0508 5.21342 21.1467 5.83398 21.1975C6.46353 21.249 7.26801 21.2502 8.40039 21.2502V22.0002L6.91699 21.9934C5.72503 21.9745 4.96098 21.9042 4.34766 21.6409L4.18359 21.5637C3.52521 21.2281 2.97417 20.7176 2.58984 20.091L2.43555 19.8157C2 18.9605 2 17.8404 2 15.6028V14.7737C2.00012 13.748 2.5235 12.7983 3.37891 12.2493L3.55469 12.1448L8.3916 9.48558C8.87716 9.21774 9.48873 9.39536 9.7666 9.87523C10.4754 11.0997 11.3884 12.5728 11.9473 13.4631C12.2128 13.8861 12.7457 14.0397 13.1934 13.841L13.2812 13.7971C14.4141 13.1568 16.5412 11.959 18.5801 10.8381L20.5488 9.76683C21.2089 9.41219 21.9999 9.89353 22 10.6428V15.6028C22 17.8404 22 18.9605 21.5645 19.8157L21.4102 20.091C21.0258 20.7176 20.4748 21.2281 19.8164 21.5637L19.6523 21.6409C18.816 22 17.6995 22.0002 15.5996 22.0002V21.2502C16.732 21.2502 17.5365 21.249 18.166 21.1975C18.7866 21.1467 19.1711 21.0508 19.4756 20.8957C20.087 20.5841 20.585 20.0861 20.8965 19.4748C21.0513 19.1707 21.1476 18.7868 21.1982 18.1672C21.2496 17.5383 21.25 16.734 21.25 15.6028Z" fill="url(#1752500502804-9183447_square-chart-line_existing_2_o3c96osrf)"></path>
                <defs>
                  <linearGradient id="1752500502804-9183447_square-chart-line_existing_0_ko3hky3pd" x1="12" y1="2" x2="12" y2="18" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#575757"></stop>
                    <stop offset="1" stop-color="#151515"></stop>
                  </linearGradient>
                  <linearGradient id="1752500502804-9183447_square-chart-line_existing_1_vl0j8v33y" x1="12" y1="9.361" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#E3E3E5" stop-opacity=".6"></stop>
                    <stop offset="1" stop-color="#BBBBC0" stop-opacity=".6"></stop>
                  </linearGradient>
                  <linearGradient id="1752500502804-9183447_square-chart-line_existing_2_o3c96osrf" x1="12" y1="9.361" x2="12" y2="16.68" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#fff"></stop>
                    <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
                  </linearGradient>
                  <filter id="1752500502804-9183447_square-chart-line_filter_kwhh3qkup" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
                  </filter>
                  <clipPath id="1752500502804-9183447_square-chart-line_clipPath_lvme5u893">
                    <path d="M9.7666 9.87523C9.48873 9.39536 8.87716 9.21774 8.3916 9.48558L3.55455 12.1452C2.59573 12.6724 2 13.6798 2 14.774V16.5998V16.6031C2 18.8398 2 18.9605 2.43555 19.8157C2.81896 20.5681 3.43117 21.1802 4.18359 21.5637C5.03924 21.9997 6.16018 22.0002 8.40039 22.0002H15.5996C17.8398 22.0002 18.9608 21.9997 19.8164 21.5637C20.5688 21.1802 21.181 20.5681 21.5645 19.8157C22 18.9605 22 17.8408 22 15.6031V15.5998V10.6428C21.9999 9.89353 21.2089 9.41219 20.5488 9.76683C18.0694 11.099 14.7916 12.9434 13.2812 13.7971C12.8177 14.0591 12.2304 13.9141 11.9473 13.4631C11.3884 12.5728 10.4754 11.0997 9.7666 9.87523Z" fill="url(#1752500502804-9183447_square-chart-line_existing_1_vl0j8v33y)"></path>
                  </clipPath>
                  <mask id="1752500502804-9183447_square-chart-line_mask_66dhv0iub">
                    <rect width="100%" height="100%" fill="#FFF"></rect>
                    <path d="M9.7666 9.87523C9.48873 9.39536 8.87716 9.21774 8.3916 9.48558L3.55455 12.1452C2.59573 12.6724 2 13.6798 2 14.774V16.5998V16.6031C2 18.8398 2 18.9605 2.43555 19.8157C2.81896 20.5681 3.43117 21.1802 4.18359 21.5637C5.03924 21.9997 6.16018 22.0002 8.40039 22.0002H15.5996C17.8398 22.0002 18.9608 21.9997 19.8164 21.5637C20.5688 21.1802 21.181 20.5681 21.5645 19.8157C22 18.9605 22 17.8408 22 15.6031V15.5998V10.6428C21.9999 9.89353 21.2089 9.41219 20.5488 9.76683C18.0694 11.099 14.7916 12.9434 13.2812 13.7971C12.8177 14.0591 12.2304 13.9141 11.9473 13.4631C11.3884 12.5728 10.4754 11.0997 9.7666 9.87523Z" fill="#000"></path>
                  </mask>
                </defs>
              </g>
            </svg>
            </div>
            <span className="text-lg font-medium whitespace-nowrap overflow-hidden text-[var(--sidebar-foreground)]"
              style={{ fontFamily: "'Lastik', serif" }}>
              <span className="text-black dark:text-white">Wingman</span>
            </span>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapsed}
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)] bg-[var(--sidebar-accent)] text-[var(--sidebar-foreground)] border border-[var(--sidebar-border)]"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <CollapseIcon />
        </button>
      </div>

      {/* ── Participants ── */}
      {!collapsed && currentParticipants?.length > 0 && (
        <div className="px-4 py-3.5 flex-shrink-0 border-b border-[var(--sidebar-border)]">
          <p className="text-[9px] uppercase tracking-widest mb-2 font-mono text-[var(--sidebar-foreground)] opacity-50">
            Participants
          </p>
          <div className="flex flex-col gap-1.5">
            {currentParticipants.slice(0, 4).map(p => (
              <div key={p} className="flex items-center gap-2.5 py-0.5">
                <Avatar name={p} size={20} single />
                <span className="text-[11px] truncate text-[var(--sidebar-foreground)] opacity-90">
                  {p.length > 18 ? p.slice(0, 16) + "…" : p}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsed: participant avatars stacked */}
      {collapsed && currentParticipants?.length > 0 && (
        <div className="flex flex-col items-center gap-2 py-4 flex-shrink-0 border-b border-[var(--sidebar-border)]">
          {currentParticipants.slice(0, 3).map(p => (
            <div key={p} title={p}>
              <Avatar name={p} size={24} single />
            </div>
          ))}
        </div>
      )}

      {/* ── Nav items ── */}
      {activeChat && (
        <nav className="flex flex-col gap-1 flex-shrink-0 px-2 py-3 border-b border-[var(--sidebar-border)]">
          {NAV_ITEMS.map(n => (
            <NavItem key={n.id} item={n} active={activeNav === n.id} onClick={onSelectNav} collapsed={collapsed} />
          ))}
        </nav>
      )}

      {/* ── Saved chats ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 min-h-0">
        {!collapsed && (
          <div className="flex items-center justify-between mb-2.5 px-2">
            <p className="text-[9px] uppercase tracking-widest font-mono text-[var(--sidebar-foreground)] opacity-50">
              Saved Chats
            </p>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--sidebar-accent)] text-[var(--sidebar-foreground)] opacity-70 font-mono">
              {chats.length}
            </span>
          </div>
        )}

        {chats.length === 0 && !collapsed && (
          <p className="text-[10px] text-center py-6 px-2 leading-relaxed font-mono text-[var(--sidebar-foreground)] opacity-40">
            No saved chats yet.
          </p>
        )}

        <div className="flex flex-col gap-1">
          {chats.map(c => (
            <ChatItem
              key={c.id} chat={c}
              active={c.id === activeChat}
              collapsed={collapsed}
              onClick={onSelectChat}
              onDelete={onDeleteChat}
              onRename={onRenameChat}
            />
          ))}
        </div>
      </div>

      {/* ── New Analysis button ── */}
      <div
        className="flex-shrink-0 p-4 border-t border-[var(--sidebar-border)]"
      >
        {collapsed ? (
          <button
            onClick={onNewAnalysis}
            title="New Analysis"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-90 dark:bg-neutral-300 bg-neutral-900  text-neutral-50 font-bold"
          >
            <span className="text-base text-neutral-50 dark:text-neutral-900 font-semibold leading-none">+</span>
          </button>
        ) : (
          <button
            onClick={onNewAnalysis}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 dark:bg-neutral-300 bg-neutral-900 dark:text-neutral-900 text-neutral-50"
            
          >
            + New Analysis
          </button>
        )}
      </div>
    </aside>
  );
}

export { NAV_ITEMS };