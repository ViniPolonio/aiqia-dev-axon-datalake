import React from "react";

const TableSkeleton = () => {
    return (
        <div className="w-full items-center flex flex-col">
            <div className="rounded-md border  w-[20%] dark:bg-gray-700 m-5">
                <div className="animate-pulse">
                    <div className="p-4">
                        <div className="flex items-center justify-center space-x-1 dark:bg-gray-700">
                            <div className="h-6 w-[80%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="rounded-md border w-full dark:bg-gray-700 m-5">
                <div className="animate-pulse">
                    <div className="p-4">
                        <div className="flex items-center space-x-8 dark:bg-gray-700">
                            <div className="h-6 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="h-6 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="h-6 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="h-6 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="h-6 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="h-6 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="h-6 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="h-6 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                        </div>
                    </div>
                    <div className="h-[400px] bg-gray-200 dark:bg-gray-700">
                        <div className="space-y-9 bp-2 tp-2 lb-1 rb-1">
                            {[...Array(5)].map((_, index) => (
                                <div
                                    key={index}
                                    className="flex space-x-4 items-center p-1"
                                >
                                    <div className="h-9 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="h-9 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="h-9 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="h-9 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="h-9 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="h-9 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="h-9 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="h-9 w-[12.5%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    <div className="h-4 w-[1%] bg-gray-300 dark:bg-gray-600 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableSkeleton;
