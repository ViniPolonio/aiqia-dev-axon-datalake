"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SuccessAlert } from "../../SuccessAlert/SuccessAlert";
import { FailedAlert } from "../../FailedAlert/FailedAlert";
import { storeControllConfig } from "@/app/services/controlConfig";

const formSchema = z.object({
    process_name: z.string().max(255),
});

interface CreateTableFormProps {
    onSuccess: () => void;
}

export function CreateControllConfigForm({ onSuccess }: CreateTableFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successCreated, setSuccessCreated] = useState(false);
    const [failedCreated, setFailedCreated] = useState(false);
    const [ProcessName, setProcessName] = useState("");
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const response = await storeControllConfig(values);
            if (response && response.status == 200) {
                setProcessName(values.process_name);
                setSuccessCreated(true);
                setFailedCreated(false);
                onSuccess();
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
    return (
        <div>
            {successCreated && (
                <SuccessAlert
                    name={ProcessName}
                    type="O processo"
                    width="w-[400px]"
                />
            )}
            {failedCreated && (
                <FailedAlert type="tabela de configuração" width="w-[400px]" />
            )}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-[700px]"
                >
                    <Card className="w-[400px] h-[300px]">
                        <CardHeader>
                            <CardTitle>Criar Processo</CardTitle>
                            <CardDescription>
                                Insira os dados nos campos para criar o processo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <FormField
                                        control={form.control}
                                        name="process_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Nome do Processo
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nome do Processo..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Nome do processo
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-around">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="transition duration-700 ease-in-out bg-gray-900 hover:bg-gray-700 text-white"
                            >
                                {isSubmitting ? "Salvando..." : "Salvar"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
