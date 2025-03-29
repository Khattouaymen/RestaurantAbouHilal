interface BackgroundPatternProps {
  className?: string;
}

export default function BackgroundPattern({ className = "" }: BackgroundPatternProps) {
  return (
    <div 
      className={`absolute inset-0 z-0 opacity-10 ${className}`}
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1557248209-2392902286cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60")',
        backgroundSize: '300px',
        backgroundRepeat: 'repeat'
      }}
    ></div>
  );
}
