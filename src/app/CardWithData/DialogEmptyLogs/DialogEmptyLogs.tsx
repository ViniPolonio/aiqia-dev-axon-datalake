import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DialogEmptyLogsProps {
    name: string;
}

export default function DialogEmptyLogs({name}: DialogEmptyLogsProps) {

    return (
        <AlertDialog>
            {/* <AlertDialogTrigger asChild>
                <Button variant="outline">Show Dialog</Button>
            </AlertDialogTrigger> */}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Sem logs registrados
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Esse processo ainda nao possui nenhum log registrado
                    </AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    );
}   