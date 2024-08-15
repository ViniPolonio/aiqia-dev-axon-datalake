import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React, { useState } from "react"
import { editTable, getConfigTableById } from "@/app/services/configurationTable"
import { EditButtonSubmit } from "../components/EditButtonSubmit/EditButtonSubmit"
import EditFormSkeleton from "../components/EditFormSkeleton/EditFormSkeleton"
import { DeleteButtonTable } from "../components/DeleteButton/DeleteButtonTable/DeleteButtonTable"

interface EditTableProps{
    id?: number,
    oracle_name?: string, 
    mysql_name?:string,
    field_check_name?: string, 
    uniq_fields_name?: string,
}

const formSchema = z.object({
    oracle_name: z.string().min(1, {
        message: "O campo precisa ter no minimo 1 caracter",
        }).max(255, {
            message: "O campo pode ter no maximo 255 caracter",
    }),
    mysql_name: z.string().min(1, {
        message: "O campo precisa ter no minimo 1 caracter",
        }).max(255, {
            message: "O campo pode ter no maximo 255 caracter",
    }),
    field_check_name: z.string().min(1, {
        message: "O campo precisa ter no minimo 1 caracter",
        }).max(255, {
            message: "O campo pode ter no maximo 255 caracter",
    }),
    uniq_fields_name: z.string().min(1, {
        message: "O campo precisa ter no minimo 1 caracter",
        }).max(255, {
            message: "O campo pode ter no maximo 255 caracter",
    }),


})

export default function EditTable({
        oracle_name, 
        mysql_name,
        field_check_name, 
        uniq_fields_name,
    } : EditTableProps) {
        const [loading, setLoading] = useState(true);
        const [id, setId] = useState<string | null>(null)
        const [dataTable, setDataTable] = useState<EditTableProps>()
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [editSuccess, setEditSuccess] = useState(false);
        const [editFailed, setEditFailed] = useState(false);

        React.useEffect(() => {
            const path = window.location.pathname;
            const extractedId = path.split("/").pop();
            if (extractedId) {
                setId(extractedId);
            } else {
                console.error("ID não encontrado na URL");
                return;
            }
            const getData = async () => {
                setLoading(true);
                try {
                    const result = await getConfigTableById(id)
                    const oldData = result.data

                    const Data: EditTableProps = {
                        id: parseInt(extractedId),
                        oracle_name: oldData.oracle_name,
                        mysql_name: oldData.mysql_name,
                        field_check_name: oldData.field_check_name, 
                        uniq_fields_name: oldData.field_check_name,
                    }
                    setDataTable(Data);
                    form.reset(Data)
                } catch(error) {
                    console.error("Erro ao buscar logs:", error);
                } finally {
                    setLoading(false);
                }
            }; getData();
        }, [id])
        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                oracle_name: oracle_name,
                mysql_name: mysql_name,
                field_check_name: field_check_name,
                uniq_fields_name: uniq_fields_name
            },
        })
        
        async function onSubmit(values: z.infer<typeof formSchema>) {
            setIsSubmitting(true);
            try {
                const payload = { ...values, id: id };
                const response = await editTable(id, payload);
                if(response && response.status == 1){
                    setEditSuccess(true);
                    setEditFailed(false);
                  } else {
                    setEditSuccess(false);
                    setEditFailed(true);
                  }
            } catch (error) {
                console.error("Erro ao criar configuracao", error);
                setEditSuccess(false);
                setEditFailed(true);
            }  finally {
                setIsSubmitting(false);
            }
        }

        return (
        <Form  {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {loading ? ( 
                <EditFormSkeleton
                  cardHeight = 'h-[660px]'
                />  
            ) : (
            <Card className="w-[400px] h-[660px]">
            <CardHeader>
                <CardTitle>Edição tabela de configuração</CardTitle>
                <CardDescription>Edite os campos que deseja alterar</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                    <FormField
                        control={form.control}
                        name="oracle_name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nome do oracle</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome oracle..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Editar o nome do oracle
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                    <FormField
                        control={form.control}
                        name="mysql_name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nome no MySQL</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome no MySQL..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Editar o nome do MySQL
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                    <FormField
                        control={form.control}
                        name="field_check_name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nome de verificação</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome do campo de verificação..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Editar o nome do campo de verificação
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                    <FormField
                        control={form.control}
                        name="uniq_fields_name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nome do campo unico</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome campo unico..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Editar o nome do campo unico
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>

                </div>
            </CardContent>
            <CardFooter className="flex justify-around" >
            <EditButtonSubmit
                isSubmitting = {isSubmitting}
                editFailed = {editFailed}
                editSuccess = {editSuccess}
                disabled={dataTable === null}
            />
            <DeleteButtonTable
                id={Number(id)}
            />
            </CardFooter>
            </Card>
        )}
        </form>
        </Form>
    )
}