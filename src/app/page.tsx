"use client"

import { CardWithData } from "./CardWithData/CardWithData";
import { useEffect, useState } from "react";
import { SearchAndFilter } from "./SearchAndFilter/SearchAndFilter";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { AddButton } from "@/components/botoes/AddButton/AddButton";
import { TimeButton } from "@/components/botoes/TImeButton/TimeButton";
import { getAllConfigsTable } from "@/app/services/configurationTable"; 


export type Data = {
  id: number;
  oracle_name: string;
  mysql_name: string;
  active: number;
  status: number;
  created_at: Date;
  finished_at: Date;
}
export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<Array<Data>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllConfigsTable();
        const configTables = result.data.map((item: any) => ({
          id: item.config_data.id,
          oracle_name: item.config_data.oracle_name,
          mysql_name: item.config_data.mysql_name,
          active: item.config_data.active,
          status: item.config_data.success, 
          created_at: new Date(item.config_data.created_at),
          finished_at: new Date(item.config_data.finished_at),
      }));
        setData(configTables)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const filteredData = data
  .filter(item => 
    item.oracle_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.mysql_name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => a.active === b.active ? 0 : a.active ? -1 : 1);

  return (
    <main>
      <div className="flex justify-around p-3">
        <ModeToggle/>
        <AddButton/>
        <TimeButton/>
        <SearchAndFilter searchTerm={searchTerm} onSearchChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <div className=" flex flex-wrap justify-center">

      {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="p-5 flex-grow-0">
              <CardWithData 
                loading={true}
                id={1}
                date={new Date("01-01-2024 00:00:00")}
                active={0}
                status={1}
                nomeOracle={""}
                nomeInterno={""} 
              />
            </div>
          ))
        ) : (
          filteredData.map((item) => (
            <div key={item.id} className="p-5 flex-grow-0">
              <CardWithData
                id={item.id}
                date={item.status == 2 ? item.created_at : item.finished_at}
                active={item.active}
                status={item.status}
                nomeOracle={item.oracle_name}
                nomeInterno={item.mysql_name}
              />
            </div>
          ))
        )}
      
      </div>
    </main>
  );
}
