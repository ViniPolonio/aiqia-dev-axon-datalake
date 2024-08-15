"use client";

import * as React from "react";
import { Trash2 } from "lucide-react"; // Certifique-se de que o ícone está disponível no pacote

import { Button } from "@/components/ui/button";
import { deleteTime } from "@/app/services/configurationTime";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  id: number;
  sync_table_config_id: number;
  disabled: boolean; 
}

export function DeleteButtonTime({
    id,
    sync_table_config_id,
    disabled
}: DeleteButtonProps) {
    const router = useRouter();
    
    const handleDelete = async () => {
        try {
          if (!disabled) {
            window.location.reload();
            const response = deleteTime(id)
            router.refresh();
          }
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
        className=" flex items-center justify-center"
      >
        <Trash2 className="transition-colors duration-700 hover:text-red-500" />
      </Button>
    );
  }

