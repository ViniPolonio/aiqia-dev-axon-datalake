import { Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface SuccessAlertProps {
    name: string,
    type: string,
    width?: string,
}

export function SuccessAlert({ 
  name,
  type,
  width }: SuccessAlertProps) {
    return (
        <Alert
            className={`${width} bg-green-100 border-l-4 border-green-500 text-green-700 mb-10`}
        >
            <Terminal className="h-4 w-4" />
            <AlertTitle>{name} criado!</AlertTitle>
            <AlertDescription>
                {type} foi criada com sucesso!
            </AlertDescription>
        </Alert>
    );
}
