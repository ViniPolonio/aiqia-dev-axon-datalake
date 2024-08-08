import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReturnButton() {
    const router = useRouter();
    const handleReturn = () => {
        router.push(`/`);
    }
    return (
        <Button onClick={handleReturn} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
        </Button>
    )
}