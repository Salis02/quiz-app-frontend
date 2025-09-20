import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCategories();
      // tergantung respon API (cek kalau perlu .data)
      setCategories(res.data || res);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    try {
      await adminService.createCategory({ name: newCategory });
      toast.success("Category created");
      setNewCategory("");
      loadCategories();
    } catch {
      toast.error("Failed to create category");
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      await adminService.updateCategory(id, { name: editName });
      toast.success("Category updated");
      setEditing(null);
      setEditName("");
      loadCategories();
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await adminService.deleteCategory(id);
      toast.success("Category deleted");
      loadCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Categories</h1>

      {/* Tambah Kategori */}
      <Card className="max-w-md">
        <div className="flex items-end gap-3">
          <Input
            label="New Category"
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleAdd}
            loading={loading}
            className="h-10"
          >
            Add
          </Button>
        </div>
      </Card>

      {/* List Categories */}
      <Card>
        {loading ? (
          <p>Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">No categories found.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between border-b pb-3 last:border-0"
              >
                {editing === cat.id ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleUpdate(cat.id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={X}
                      onClick={() => {
                        setEditing(null);
                        setEditName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="font-medium">{cat.name}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Edit}
                        onClick={() => {
                          setEditing(cat.id);
                          setEditName(cat.name);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(cat.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
