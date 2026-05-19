/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import type { TablePaginationConfig } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Table, Button } from "antd";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { CatalogueRow } from "../../types";

const DEFAULT_PAGINATION: TablePaginationConfig = {
  defaultPageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: [10, 20, 50, 100],
  showQuickJumper: false,
};

interface ServiceTableProps {
  dataSource: CatalogueRow[];
  pagination?: TablePaginationConfig | false;
  rowSelection?: any;
  onCheckAvailability?: (row: CatalogueRow) => void;
  prependColumns?: ColumnsType<any>;
  additionalColumns?: ColumnsType<any>;
}

export const ServiceTable: FC<ServiceTableProps> = ({
  dataSource,
  pagination,
  rowSelection,
  onCheckAvailability,
  prependColumns = [],
  additionalColumns = [],
}) => {
  const resolvedDefaultPageSize =
    (typeof pagination === "object" && pagination.defaultPageSize) || 10;

  const [tablePagination, setTablePagination] = useState({
    current: 1,
    pageSize: resolvedDefaultPageSize,
  });

  useEffect(() => {
    setTablePagination((prev) => ({ current: 1, pageSize: prev.pageSize }));
  }, [dataSource.length]);

  const paginationConfig: TablePaginationConfig | false =
    pagination === false
      ? false
      : {
          ...DEFAULT_PAGINATION,
          ...pagination,
          showQuickJumper: false,
          current: tablePagination.current,
          pageSize: tablePagination.pageSize,
          onChange: (page, pageSize) => {
            setTablePagination({
              current: page,
              pageSize: pageSize ?? tablePagination.pageSize,
            });
          },
          onShowSizeChange: (_current, size) => {
            setTablePagination({ current: 1, pageSize: size });
          },
        };
  const baseColumns: ColumnsType<any> = [
    {
      title: "Service",
      dataIndex: ["service", "name"],
      key: "serviceName",
    },
    {
      title: "Clinic",
      dataIndex: ["clinic", "name"],
      key: "clinicName",
    },
    {
      title: "Optician",
      dataIndex: ["clinic", "opticians"],
      key: "opticians",
      render: (opticians: { id: string; name: string }[]) =>
        opticians.map((optician) => optician.name).join(", "),
    },
    ...(onCheckAvailability
      ? [
          {
            title: "Action",
            key: "action",
            render: (_: any, record: CatalogueRow) => (
              <Button size="small" onClick={() => onCheckAvailability(record)}>
                Check Availability
              </Button>
            ),
          },
        ]
      : []),
  ];

  const columns = [...prependColumns, ...baseColumns, ...additionalColumns];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={paginationConfig}
      rowSelection={rowSelection}
      rowKey={(record: CatalogueRow) =>
        `${record.service.id}-${record.clinic.id}-${record.clinic.opticians[0]?.id ?? ""}`
      }
    />
  );
};
