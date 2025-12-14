import { useState } from "react";

const CollapsibleText: React.FC<{ text: string; limit?: number }> = ({ text, limit = 200 }) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    const isLong = text.length > limit;
    const preview = isLong ? text.slice(0, limit) + "..." : text;

    return (
        <div>
            <p className="whitespace-pre-line font-semibold text-sm text-[#4a4a4a]">
                {expanded ? text : preview}
            </p>

            {isLong && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-600 font-medium text-sm mt-1 cursor-pointer hover:underline"
                >
                    {expanded ? "Read less" : "Read more"}
                </button>
            )}
        </div>
    );
};

export default CollapsibleText;
