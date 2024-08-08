import { ModeToggle } from "@/components/ui/ModeToggle";
import { AlertFailed } from "./Alert/AlertFailed";

export default function Header() {
    return (
            <div className="w-1/2 flex">
                <ModeToggle/>
            </div>
    )
}