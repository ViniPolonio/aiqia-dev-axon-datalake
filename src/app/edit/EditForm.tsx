import { useEffect, useState } from 'react';
import { getControlTimeById } from '@/app/services/controlTimeConfig';
import { CardEditTime } from './CardEditTime/CardEditTime';
import EditTable from './EditTable/EditTable';

export default function EditForm() {
    const [loading, setLoading] = useState(true);
    const [allDates, setAllDates] = useState([]);

    const getData = async () => {
            setLoading(true);
            try {
                const path = window.location.pathname;
                const extractedId = path.split('/').pop();

                if (!extractedId) {
                    console.error('ID não encontrado na URL');
                    return;
                }

                const result = await getControlTimeById(extractedId);
                const data = result.message;
                setAllDates(data || []);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                setAllDates([]);
            } finally {
                setLoading(false);
            }
        }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="flex flex-col items-center justify-between ">
            <div className="p-2">
                <EditTable />
            </div>

            <div className="p-2 flex flex-row flex-wrap justify-evenly">
                {loading ? (
                    <h1>carregando...</h1>
                ) : (
                    allDates.map((date, index) => (
                        <CardEditTime
                            onSave={getData}
                            key={index}
                            date={date}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
