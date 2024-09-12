import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ReturnUnsynchronized() {
    const router = useRouter();

    const handleReturn = () => {
        router.push(`/`);
    };

    return (
        <div className="absolute inset-0 flex flex-col justify-center items-center border border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-[70%] h-[30%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <p className="text-gray-700 dark:text-gray-400 font-sans font-medium text-lg mb-4 text-center">
                O processo não foi sincronizado ainda.
            </p>
            <Button
                onClick={handleReturn}
                variant="outline"
                size="sm"
                className="text-gray-700 dark:text-gray-400 border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 transition-all duration-150"
            >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar ao Menu
            </Button>
        </div>
    );
}
