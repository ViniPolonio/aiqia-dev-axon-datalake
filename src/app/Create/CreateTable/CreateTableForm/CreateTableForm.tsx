"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { storeConfigTable } from "@/app/services/configurationTable";
import { useState } from "react"
import { SuccessAlert } from "../../SuccessAlert/SuccessAlert"
import { FailedAlert } from "../../FailedAlert/FailedAlert"

const formSchema = z.object({
    oracle_name: z.string().max(255),
    mysql_name: z.string().max(255),
    field_check_name: z.string().max(255),
    uniq_fields_name: z.string().max(255),
  })

export function CreateTableForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successCreated, setSuccessCreated] = useState(false);
    const [failedCreated, setFailedCreated] = useState(false);
    const [OracleName, setOracleName] = useState("")
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try{
            const response = await storeConfigTable(values);
            
            if(response && response.success){
              setOracleName(values.oracle_name);
              setSuccessCreated(true);
              setFailedCreated(false);
            } else {
              setSuccessCreated(false);
              setFailedCreated(true);
            }
        } catch (error) {
            console.error("Erro ao criar configuracao", error);
            setSuccessCreated(false);
            setFailedCreated(true);
        } finally {
            setIsSubmitting(false);
        }
    }
    return(
      <div>
        {successCreated && ( 
            <SuccessAlert name={OracleName} type="tabela de configuração" />
          )}
          {failedCreated && ( 
            <FailedAlert type="tabela de configuração" />
          )}
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[700px]">
        <FormField
          control={form.control}
          name="oracle_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Oracle</FormLabel>
              <FormControl>
                <Input placeholder="Nome do oracle" {...field} />
              </FormControl>
              <FormDescription>
                Nome salvo no banco de dados da oracle
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mysql_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Mysql</FormLabel>
              <FormControl>
                <Input placeholder="Nome do Mysql" {...field} />
              </FormControl>
              <FormDescription>
                Nome salvo no banco de dados interno do mysql
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="field_check_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de verificacao</FormLabel>
              <FormControl>
                <Input placeholder="Nome de verificacao" {...field} />
              </FormControl>
              <FormDescription>
                Nome do campo de verificacao
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="uniq_fields_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Campo Unico</FormLabel>
              <FormControl>
                <Input placeholder="Nome Campo Unico" {...field} />
              </FormControl>
              <FormDescription>
                Nome Campo Unico
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        

        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
    </div>
    );
}