import React from 'react';

interface EditFormSkeletonProps {
  cardHeight?: string;
  buttonSize?: string;
  isTimeForm?: boolean;
}

export default function EditFormSkeleton({
  cardHeight = 'h-[700px]',
  buttonSize = 'w-[200px] h-8',
  isTimeForm = false,
}: EditFormSkeletonProps) {
  return (
      <div
          className={`w-[500px] ${cardHeight} animate-pulse bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-600`}
      >
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
              <div
                  className={`bg-gray-200 dark:bg-gray-600 h-8 mb-4 rounded w-3/4`}
              ></div>
              <div
                  className={`bg-gray-200 dark:bg-gray-600 h-6 mb-2 rounded w-1/2`}
              ></div>
          </div>
          {isTimeForm ? (
              <div className="p-4 space-y-20">
                  <div
                      className={`bg-gray-200 dark:bg-gray-600 h-12 rounded`}
                  ></div>
                  <div
                      className={`bg-gray-200 dark:bg-gray-600 h-12 rounded`}
                  ></div>
                  <div
                      className={`bg-gray-200 dark:bg-gray-600 h-12 rounded`}
                  ></div>
                  <div
                      className={`bg-gray-200 dark:bg-gray-600 h-8 rounded w-1/2`}
                  ></div>
              </div>
          ) : (
              <div className="p-4 space-y-20">
                  <div
                      className={`bg-gray-200 dark:bg-gray-600 h-12 rounded`}
                  ></div>
              </div>
          )}

          <div className=" p-4 border-t border-gray-200 dark:border-gray-600 flex content-center justify-center">
              <div
                  className={`bg-gray-200 dark:bg-gray-600 ${buttonSize} rounded ml-2`}
              ></div>
          </div>
      </div>
  );
}
