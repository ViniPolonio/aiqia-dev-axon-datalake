import { Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface FailedAlertProps {
    type: string,
    erro?: string,
    width?: string,
    
}

export function FailedAlert({
    type,
    erro,
    width
}: FailedAlertProps) 
{
  return (
    <Alert className={`${width} bg-red-100 border-l-4 border-red-500 text-red-700 mb-10`}>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Erro!</AlertTitle>
      <AlertDescription>
        {type} nao foi criada, ocorreu algum erro!
      </AlertDescription>
    </Alert>
  )
}
