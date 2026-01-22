import { Dialog, DialogContent, DialogHeader, DialogTitle, lang } from "@/core/libs";
import { UserDataModel } from "@/core/models";
import { BaseActionTable, BaseDataTable } from "@/features/_global";
import { AdminCreationForm, adminUserColumns, adminUserDataFallback, useUserAdmin } from "@/features/user";
import { useMemo, useState } from "react";

export function AdminTable() {
  const biodata = useUserAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDataModel | null>(null);

  const columns = useMemo(() => {
    const cols = adminUserColumns();
    // Modify the last column (action column) to use onEdit instead of editPath
    return cols.map((col) => {
      if (col.accessorKey === "id") {
        return {
          ...col,
          cell: ({ row }) => {
            return (
              <BaseActionTable
                onEdit={() => {
                  setSelectedUser(row.original); 
                  setIsModalOpen(true);
                }}
              />
            );
          },
        };
      }
      return col;
    });
  }, []);

  return (
    <div className="bg-white/5 rounded-lg p-6 mt-4">
      <BaseDataTable
        columns={columns}
        data={biodata.data}
        dataFallback={adminUserDataFallback}
        globalSearch
        searchParamPagination
        searchPlaceholder={lang.text("search")}
        isLoading={biodata.query.isLoading}
      />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang.text("editUser")}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <AdminCreationForm
              user={selectedUser}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}