import { Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface SuccessAlertProps {
    name: string,
    type: string,
    
}

export function SuccessAlert({
    name,
    type,
}: SuccessAlertProps) 
{
  return (
    <Alert className="bg-green-100 border-l-4 border-green-500 text-green-700">
      <Terminal className="h-4 w-4" />
      <AlertTitle>{name} criado!</AlertTitle>
      <AlertDescription>
        A {type} foi criada com sucesso!
      </AlertDescription>
    </Alert>
  )
}
