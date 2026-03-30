interface Props {
  position: "above-fold" | "below-image" | "sidebar";
  className?: string;
}

export default function AdSlot({ position, className = "" }: Props) {
  // Placeholder for Google AdSense - replace with actual ad code
  // when AdSense is approved
  return (
    <div
      className={`no-print ${className}`}
      data-ad-position={position}
    >
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs min-h-[90px]">
        <span>Ad Space ({position})</span>
      </div>
    </div>
  );
}
