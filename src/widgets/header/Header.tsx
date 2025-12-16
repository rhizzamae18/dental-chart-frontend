import { useAppStore } from "@/shared/store/useAppStore";
import dentalChartLogo from "@/assets/images/dentalchartlogo.png";

export const Header = () => {
    const appState = useAppStore((state) => state.appState);
    const resetPage = useAppStore((state) => state.resetPage);


    return <>
        {appState !== 'loading' && (
            <header className="flex items-center justify-between p-3 sm:p-5 sticky top-0 z-50 bg-white border-b">
                {/* Left side: Logo and Back Button */}
                <div className="flex items-center space-x-2 sm:space-x-3">


                    <img
                        src={dentalChartLogo}
                        onClick={resetPage}
                        alt="Dental Chart Logo"
                        className="h-24 w-24 sm:h-16 sm:w-16 object-contain"
                    />
                    <h1 className="text-base sm:text-xl lg:text-xl font-bold text-primary">
                        Dental Chart Digitizer
                    </h1>
                </div>

                {/* <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm font-medium text-text-secondary hidden sm:inline">
                        Page {currentPage} of 4
                    </span>
                    <span className="text-xs font-medium text-text-secondary sm:hidden">
                        {currentPage}/4
                    </span>
                    <div className="flex gap-1 sm:gap-1.5">
                        {[1, 2, 3, 4].map((page) => (
                            <div
                                key={page}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${page <= currentPage
                                    ? 'bg-primary'
                                    : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div> */}
            </header>
        )}
    </>
}