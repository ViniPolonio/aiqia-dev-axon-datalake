

  "use client";

import * as React from "react";
import { Trash2 } from "lucide-react"; // Certifique-se de que o ícone está disponível no pacote

import { Button } from "@/components/ui/button";
import { deleteTable } from "@/app/services/configurationTable";
import { useRouter } from "next/navigation";

interface DeleteButtonProps{
    id: number;
    disabled: boolean;
}


export function DeleteButtonTable({
    id
}: DeleteButtonProps) {
    const router = useRouter();
    const handleDelete = async () => {
        try {
            const response = deleteTable(id)
            router.push(`/`)
        } catch (error) {
            console.error("Erro ao deletar tabela: ", error);
            throw error;
        }
    }
    
  return (
    <Button
      title="Excluir"
      variant="outline"
      size="icon"
      onClick={handleDelete}
      className="p-0 flex items-center justify-center"
    >
      <Trash2 className=" transition-colors duration-700 hover:text-red-500" />
    </Button>
  );
}


  