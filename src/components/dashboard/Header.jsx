import React from "react";
import { BarChart3, RefreshCw } from "lucide-react";

const Header = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const onRefresh = () => {
    setIsLoading(true);
    window.location.reload();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 ">
      <div className="flex items-center">
        <div className="p-2 rounded-lg bg-primary/20 text-primary animate-glow">
          <BarChart3 className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold ubuntu">
            Sales Dashboard
          </h1>
          <p className="text-sm text-gray-50/50 open-sans">
            Real-time sales analytics and insights
          </p>
        </div>
      </div>
      <button
        variant="outline"
        onClick={onRefresh}
        disabled={isLoading}
        className="relative rounded-xl px-8 py-3 overflow-hidden group bg-[#0da2e7] hover:bg-gradient-to-r hover:from-[#09a0e6] hover:to-[#0da2e7] text-white hover:ring-2 hover:ring-offset-2 hover:ring-[#0da2e7] transition-all ease-out duration-300"
      >
        <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
        <span className="relative flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <p>Refresh</p>
        </span>
      </button>
    </header>
  );
};

export default Header;
