interface LoaderProps {
    title?: string;
    description?: string;
}

const Loader = ({ title = "Loading details", description = "Please wait while we fetch the information." }: LoaderProps) => {
    return (
        <div
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 bg-white"
        >
            {/* Scoped animations (no tailwind.config changes needed) */}
            <style>{`
                .ld-art * { transform-box: fill-box; }
                @keyframes ld-spin    { to { transform: rotate(360deg); } }
                @keyframes ld-dash    { to { stroke-dashoffset: -12; } }
                @keyframes ld-bounce  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
                @keyframes ld-ring    { 0% { transform: scale(.6); opacity: .8; } 100% { transform: scale(2.2); opacity: 0; } }
                @keyframes ld-search  { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(10px,6px) rotate(6deg); } }
                @keyframes ld-glow    { 0%,100% { fill: #FFC857; } 50% { fill: #FFE7A8; } }
                @keyframes ld-twinkle { 0%,100% { opacity: .3; transform: scale(.7); } 50% { opacity: 1; transform: scale(1.1); } }
                @keyframes ld-drift   { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-8px); } }
                @keyframes ld-wave    { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(.8); } }
                @keyframes ld-hop     { 0%,60%,100% { transform: translateY(0); opacity: .35; } 30% { transform: translateY(-9px); opacity: 1; } }
                .ld-spin    { transform-origin: center; animation: ld-spin 40s linear infinite; }
                .ld-route   { animation: ld-dash .8s linear infinite; }
                .ld-pin     { transform-origin: center bottom; animation: ld-bounce 1.6s ease-in-out infinite; }
                .ld-ring    { transform-origin: center; animation: ld-ring 1.6s ease-out infinite; }
                .ld-lens    { transform-origin: center; animation: ld-search 3.5s ease-in-out infinite; }
                .ld-lit     { animation: ld-glow 2.4s ease-in-out infinite; }
                .ld-twinkle { transform-origin: center; animation: ld-twinkle 2.4s ease-in-out infinite; }
                .ld-cloud   { animation: ld-drift 7s ease-in-out infinite; }
                .ld-flag    { transform-origin: left center; animation: ld-wave 1.4s ease-in-out infinite; }
                .ld-d1 { animation-delay: 0s; }
                .ld-d2 { animation-delay: .6s; }
                .ld-d3 { animation-delay: 1.2s; }
                .ld-d4 { animation-delay: 1.8s; }
                .ld-dot { animation: ld-hop 1.2s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .ld-art *, .ld-dot { animation: none !important; }
                    .ld-dot { opacity: .7; }
                }
            `}</style>

            {/* Hotel booking illustration */}
            <svg
                className="ld-art w-72 max-w-full h-auto mb-4"
                viewBox="0 0 320 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="ld-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#DFEBFF" /><stop offset="1" stopColor="#F6F9FF" /></linearGradient>
                    <clipPath id="ld-map-clip"><polygon points="46,160 274,160 306,222 14,222" /></clipPath>
                    <clipPath id="ld-lens-clip"><circle cx="82" cy="84" r="16" /></clipPath>
                    <polygon id="ld-star" points="0,-4 0.94,-1.29 3.8,-1.24 1.52,0.49 2.35,3.24 0,1.6 -2.35,3.24 -1.52,0.49 -3.8,-1.24 -0.94,-1.29" />
                </defs>
                <circle cx="160" cy="112" r="104" fill="url(#ld-sky)" />
                <circle cx="160" cy="112" r="104" stroke="#BCD0F3" strokeWidth="1.5" strokeDasharray="3 7" strokeLinecap="round" className="ld-spin" />
                <circle cx="246" cy="56" r="22" fill="#FFD27A" fillOpacity=".25" />
                <circle cx="246" cy="56" r="14" fill="#FFD27A" />
                <g className="ld-cloud">
                    <g fill="#D3E2FA"><rect x="222" y="66" width="46" height="12" rx="6" /><circle cx="236" cy="65" r="9" /><circle cx="250" cy="62" r="11" /></g>
                    <g fill="#fff"><rect x="222" y="64" width="46" height="12" rx="6" /><circle cx="236" cy="63" r="9" /><circle cx="250" cy="60" r="11" /></g>
                </g>
                <g fill="#9DB4F5" className="ld-twinkle"><path d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2Z" transform="translate(64,46)" /></g>
                <g fill="#FFC857" className="ld-twinkle ld-d2"><path d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2Z" transform="translate(150,22)" /></g>
                <g fill="#9DB4F5" className="ld-twinkle ld-d3"><path d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1Z" transform="translate(272,112)" /></g>
                <ellipse cx="160" cy="230" rx="142" ry="6" fill="#B8C9E8" fillOpacity=".55" />
                <polygon points="14,222 306,222 306,228 14,228" fill="#9CC4AE" />
                <polygon points="46,160 122,160 111.3,222 14,222" fill="#D9F0E3" />
                <polygon points="122,160 198,160 208.7,222 111.3,222" fill="#E8F7EE" />
                <polygon points="198,160 274,160 306,222 208.7,222" fill="#D9F0E3" />
                <g clipPath="url(#ld-map-clip)">
                    <rect x="54" y="166" width="46" height="22" rx="9" fill="#A8E2BF" />
                    <ellipse cx="262" cy="212" rx="22" ry="8" fill="#A8E2BF" />
                    <path d="M96 224 C 130 206, 190 218, 240 192 S 300 176, 316 180" stroke="#A9D6FF" strokeWidth="9" strokeLinecap="round" />
                    <path d="M0 196 L320 196" stroke="#fff" strokeWidth="3" />
                    <path d="M88 150 L70 230" stroke="#fff" strokeWidth="3" />
                    <path d="M232 150 L252 230" stroke="#fff" strokeWidth="3" />
                    <path d="M30 176 L110 176" stroke="#fff" strokeWidth="2" strokeOpacity=".7" />
                    <path d="M200 172 L290 172" stroke="#fff" strokeWidth="2" strokeOpacity=".7" />
                </g>
                <path d="M122 160 L111.3 222 M198 160 L208.7 222" stroke="#BFE3CE" strokeWidth="1.2" />
                <rect x="79" y="124" width="36" height="6" rx="2" fill="#C9D7F3" />
                <rect x="82" y="130" width="30" height="70" fill="#DDE7FA" stroke="#C3D2F0" strokeWidth="1" />
                <rect x="88" y="138" width="9" height="8" rx="1.5" fill="#F4F8FF" stroke="#C3D2F0" strokeWidth="1" /><rect x="101" y="138" width="9" height="8" rx="1.5" fill="#F4F8FF" stroke="#C3D2F0" strokeWidth="1" /><rect x="88" y="152" width="9" height="8" rx="1.5" fill="#F4F8FF" stroke="#C3D2F0" strokeWidth="1" /><rect x="101" y="152" width="9" height="8" rx="1.5" fill="#F4F8FF" stroke="#C3D2F0" strokeWidth="1" /><rect x="88" y="166" width="9" height="8" rx="1.5" fill="#F4F8FF" stroke="#C3D2F0" strokeWidth="1" /><rect x="101" y="166" width="9" height="8" rx="1.5" fill="#F4F8FF" stroke="#C3D2F0" strokeWidth="1" /><rect x="88" y="180" width="9" height="8" rx="1.5" fill="#F4F8FF" stroke="#C3D2F0" strokeWidth="1" /><rect x="101" y="180" width="9" height="8" rx="1.5" fill="#F4F8FF" stroke="#C3D2F0" strokeWidth="1" />
                <polygon points="120,82 140,72 220,72 200,82" fill="#EEF3FD" stroke="#C9D6EE" strokeWidth="1" strokeLinejoin="round" />
                <polygon points="200,82 220,72 220,192 200,202" fill="#D5E0F5" stroke="#C0D0EE" strokeWidth="1" strokeLinejoin="round" />
                <rect x="120" y="82" width="80" height="120" fill="#fff" stroke="#C9D6EE" strokeWidth="1" />
                <polygon points="204,110 216,104 216,116 204,122" fill="#BFCFEF" /><polygon points="204,127 216,121 216,133 204,139" fill="#BFCFEF" /><polygon points="204,144 216,138 216,150 204,156" fill="#BFCFEF" />
                <path d="M170 77 L170 54" stroke="#6C7BA8" strokeWidth="1.5" strokeLinecap="round" />
                <polygon points="170,54 188,60 170,66" fill="#FF6B4A" className="ld-flag" />
                <rect x="130" y="90" width="60" height="14" rx="7" fill="#3B5BDB" />
                <use href="#ld-star" x="145" y="97" fill="#FFC857" /><use href="#ld-star" x="160" y="97" fill="#FFC857" /><use href="#ld-star" x="175" y="97" fill="#FFC857" />
                <rect x="127" y="112" width="12" height="12" rx="2" fill="#DCE8FB" stroke="#BBCDEE" strokeWidth="1" /><rect x="145" y="112" width="12" height="12" rx="2" fill="#FFC857" stroke="#F0A92E" strokeWidth="1" className="ld-lit ld-d1" /><rect x="163" y="112" width="12" height="12" rx="2" fill="#DCE8FB" stroke="#BBCDEE" strokeWidth="1" /><rect x="181" y="112" width="12" height="12" rx="2" fill="#DCE8FB" stroke="#BBCDEE" strokeWidth="1" /><rect x="127" y="129" width="12" height="12" rx="2" fill="#DCE8FB" stroke="#BBCDEE" strokeWidth="1" /><rect x="145" y="129" width="12" height="12" rx="2" fill="#DCE8FB" stroke="#BBCDEE" strokeWidth="1" /><rect x="163" y="129" width="12" height="12" rx="2" fill="#FFC857" stroke="#F0A92E" strokeWidth="1" className="ld-lit ld-d2" /><rect x="181" y="129" width="12" height="12" rx="2" fill="#DCE8FB" stroke="#BBCDEE" strokeWidth="1" /><rect x="127" y="146" width="12" height="12" rx="2" fill="#FFC857" stroke="#F0A92E" strokeWidth="1" className="ld-lit ld-d3" /><rect x="145" y="146" width="12" height="12" rx="2" fill="#DCE8FB" stroke="#BBCDEE" strokeWidth="1" /><rect x="163" y="146" width="12" height="12" rx="2" fill="#DCE8FB" stroke="#BBCDEE" strokeWidth="1" /><rect x="181" y="146" width="12" height="12" rx="2" fill="#FFC857" stroke="#F0A92E" strokeWidth="1" className="ld-lit ld-d4" />
                <rect x="138" y="166" width="44" height="10" rx="2" fill="#FFE3DA" /><rect x="138" y="166" width="5.5" height="10" fill="#FF6B4A" /><rect x="149" y="166" width="5.5" height="10" fill="#FF6B4A" /><rect x="160" y="166" width="5.5" height="10" fill="#FF6B4A" /><rect x="171" y="166" width="5.5" height="10" fill="#FF6B4A" /><circle cx="140.75" cy="176" r="2.75" fill="#FF6B4A" /><circle cx="146.25" cy="176" r="2.75" fill="#FFE3DA" /><circle cx="151.75" cy="176" r="2.75" fill="#FF6B4A" /><circle cx="157.25" cy="176" r="2.75" fill="#FFE3DA" /><circle cx="162.75" cy="176" r="2.75" fill="#FF6B4A" /><circle cx="168.25" cy="176" r="2.75" fill="#FFE3DA" /><circle cx="173.75" cy="176" r="2.75" fill="#FF6B4A" /><circle cx="179.25" cy="176" r="2.75" fill="#FFE3DA" />
                <rect x="150" y="176" width="20" height="26" rx="2" fill="#25357A" />
                <rect x="152" y="178" width="7.5" height="24" fill="#4C62B5" />
                <rect x="160.5" y="178" width="7.5" height="24" fill="#4C62B5" />
                <circle cx="160" cy="191" r="1.3" fill="#FFC857" />
                <rect x="144" y="202" width="32" height="3" rx="1.5" fill="#C9D6EE" />
                <g><rect x="267" y="197" width="2.4" height="7" fill="#8A6A4F" /><circle cx="268" cy="193" r="8" fill="#5FC38A" /><circle cx="265" cy="190" r="3" fill="#86DBA8" /></g>
                <g><rect x="281" y="204" width="2" height="6" fill="#8A6A4F" /><circle cx="282" cy="201" r="6" fill="#5FC38A" /><circle cx="280" cy="199" r="2.2" fill="#86DBA8" /></g>
                <path d="M76 212 C 100 224, 128 214, 160 212 S 226 208, 248 192" stroke="#3B5BDB" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" className="ld-route" />
                <g>
                    <ellipse cx="55" cy="216" rx="21" ry="3" fill="#25357A" fillOpacity=".18" />
                    <path d="M49 184 V179 A3 3 0 0 1 52 176 H64 A3 3 0 0 1 67 179 V184" stroke="#25357A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="38" y="184" width="34" height="28" rx="6" fill="#3B5BDB" />
                    <rect x="46" y="184" width="4" height="28" fill="#2A44B5" />
                    <rect x="60" y="184" width="4" height="28" fill="#2A44B5" />
                    <rect x="40.5" y="188" width="3" height="20" rx="1.5" fill="#8FA6F7" fillOpacity=".6" />
                    <circle cx="55" cy="196" r="4.5" fill="#FFC857" />
                    <rect x="55" y="201" width="9" height="5" rx="2.5" fill="#6CCB95" transform="rotate(-12 59 203)" />
                    <circle cx="46" cy="213.5" r="2.5" fill="#25357A" /><circle cx="64" cy="213.5" r="2.5" fill="#25357A" />
                </g>
                <g className="ld-pin">
                    <ellipse cx="248" cy="192" rx="9" ry="3" fill="#25357A" fillOpacity=".2" />
                    <path d="M248 190 C 240 178 232 168 232 156 A16 16 0 0 1 264 156 C 264 168 256 178 248 190 Z" fill="#FF6B4A" />
                    <path d="M238 150 A11 11 0 0 1 247 142" stroke="#fff" strokeOpacity=".55" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="248" cy="156" r="6" fill="#fff" />
                </g>
                <ellipse cx="248" cy="192" rx="9" ry="3" stroke="#FF6B4A" strokeWidth="1.5" className="ld-ring" />
                <g className="ld-lens">
                    <circle cx="82" cy="84" r="17" fill="#fff" fillOpacity=".55" />
                    <g clipPath="url(#ld-lens-clip)">
                        <rect x="60" y="62" width="44" height="44" fill="#DDF3E6" />
                        <path d="M60 92 L104 76" stroke="#fff" strokeWidth="5" />
                        <path d="M78 62 L90 106" stroke="#fff" strokeWidth="4" />
                        <path d="M60 76 C 72 86, 92 96, 104 90" stroke="#A9D6FF" strokeWidth="6" />
                        <path d="M84 94 C 80 89 77 86 77 82 A7 7 0 0 1 91 82 C 91 86 88 89 84 94 Z" fill="#FF6B4A" />
                        <circle cx="84" cy="82" r="2.5" fill="#fff" />
                    </g>
                    <circle cx="82" cy="84" r="18" stroke="#25357A" strokeWidth="4" />
                    <path d="M70 78 A13 13 0 0 1 79 70" stroke="#fff" strokeOpacity=".85" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M95.5 97.5 L106 108" stroke="#25357A" strokeWidth="6" strokeLinecap="round" />
                    <path d="M104 106 L111 113" stroke="#FF6B4A" strokeWidth="6" strokeLinecap="round" />
                </g>
            </svg>

            {/* Dots wave: left → right, each hops up in turn */}
            <div className="flex items-end gap-2 h-5 mb-4" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span
                        key={i}
                        className="block w-2 h-2 rounded-full bg-[#3B5BDB] ld-dot"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>

            {/* Loader Text */}
            <p className="text-base font-semibold text-gray-800 text-center">{title}</p>

            <p className="text-sm text-gray-500 mt-2 text-center max-w-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
};

export default Loader;