import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isSubmitting: boolean;
  editSuccess: boolean;
  editFailed: boolean;
  disabled?: boolean;
}

export const EditButtonSubmit = ({ isSubmitting, editSuccess, editFailed, disabled }: SubmitButtonProps) => {
  return (
      <div className="relative w-2/3">
          <Button
              className="w-full transition duration-700 border-2  ease-in-out bg-gray-900 hover:bg-gray-700 hover:border-white text-white"
              disabled={isSubmitting || disabled}
              type="submit"
          >
              {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
          {(editSuccess || editFailed) && !isSubmitting && (
              <p
                  className={`absolute top-full mt-2 w-full text-center ${
                      editSuccess ? "text-green-500" : "text-red-500"
                  }`}
              >
                  {editSuccess
                      ? "Dados salvos com sucesso!"
                      : "Erro ao salvar os dados!"}
              </p>
          )}
      </div>
      
  );
};

