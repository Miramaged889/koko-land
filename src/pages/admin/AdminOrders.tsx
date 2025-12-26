import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  X,
  User,
  BookOpen,
  Calendar,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  listAdminRequests,
  processRequest,
  clearError,
} from "../../store/slices/purchaseSlice";
import { listBooks } from "../../store/slices/bookSlice";
import { listUsers } from "../../store/slices/userSlice";
import { PurchaseRequest, CustomizationSummary } from "../../services/api";
import { bookApi } from "../../services/api";

const AdminOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { requests, loading, error, processRequestLoading } = useAppSelector(
    (state) => state.purchase
  );
  const { books } = useAppSelector((state) => state.books);
  const { allUsers } = useAppSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] =
    useState<PurchaseRequest | null>(null);
  const [customizations, setCustomizations] = useState<CustomizationSummary[]>(
    []
  );

  useEffect(() => {
    dispatch(listAdminRequests());
    dispatch(listBooks());
    dispatch(listUsers());

    // Fetch customizations using the summary format
    const fetchCustomizations = async () => {
      try {
        const data = await bookApi.listCustomizationsSummary();
        setCustomizations(data);
      } catch (error) {
        console.error("Failed to fetch customizations:", error);
      }
    };
    fetchCustomizations();
  }, [dispatch]);

  // Helper function to get user name by ID
  const getUserName = useCallback(
    (userId: number): string => {
      const user = allUsers.find((u) => u.id === userId);
      return user
        ? `${user.first_name} ${user.last_name}`.trim()
        : `المستخدم #${userId}`;
    },
    [allUsers]
  );

  // Helper function to get book name by ID
  const getBookName = useCallback(
    (bookId: number): string => {
      const book = books.find((b) => b.id === bookId);
      return book ? book.title : `الكتاب #${bookId}`;
    },
    [books]
  );

  // Helper function to get book price by ID
  const getBookPrice = useCallback(
    (bookId: number): number | null => {
      const book = books.find((b) => b.id === bookId);
      return book ? book.price : null;
    },
    [books]
  );

  // Helper function to get customization by ID
  const getCustomization = useCallback(
    (customizationId: number): CustomizationSummary | undefined => {
      if (!customizations || !Array.isArray(customizations)) {
        return undefined;
      }
      return customizations.find((c) => c.id === customizationId);
    },
    [customizations]
  );

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    pending: "معلق",
    approved: "موافق عليه",
    rejected: "مرفوض",
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const userName = getUserName(request.user);
      const bookName = request.book ? getBookName(request.book) : "";
      const customization = request.customization
        ? getCustomization(request.customization)
        : null;
      const customizationTitle = customization ? customization.book_title : "";

      const matchesSearch =
        searchTerm === "" ||
        request.id.toString().includes(searchTerm) ||
        request.user.toString().includes(searchTerm) ||
        (request.book && request.book.toString().includes(searchTerm)) ||
        userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customizationTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [
    requests,
    searchTerm,
    statusFilter,
    getUserName,
    getBookName,
    getCustomization,
  ]);

  const handleProcessRequest = async (
    requestId: number,
    action: "approve" | "reject"
  ) => {
    try {
      await dispatch(processRequest({ requestId, data: { action } })).unwrap();
      alert(
        action === "approve"
          ? "تم الموافقة على الطلب وإضافته إلى مكتبة المستخدم"
          : "تم رفض الطلب"
      );
      setSelectedRequest(null);
      // Refresh the requests list
      dispatch(listAdminRequests());
    } catch (err: unknown) {
      alert((err as Error).message || "فشل معالجة الطلب");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-reem font-bold text-gray-800 mb-2">
          إدارة طلبات الشراء
        </h1>
        <p className="text-gray-600 font-tajawal">
          عرض وإدارة جميع طلبات شراء الكتب من المستخدمين
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-gray-600 font-tajawal text-sm mb-1">
            إجمالي الطلبات
          </p>
          <p className="text-2xl font-reem font-bold text-gray-800">
            {requests.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 font-tajawal text-sm mb-1">معلقة</p>
          <p className="text-2xl font-reem font-bold text-yellow-600">
            {requests.filter((r) => r.status === "pending").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 font-tajawal text-sm mb-1">موافق عليها</p>
          <p className="text-2xl font-reem font-bold text-green-600">
            {requests.filter((r) => r.status === "approved").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 font-tajawal text-sm mb-1">مرفوضة</p>
          <p className="text-2xl font-reem font-bold text-red-600">
            {requests.filter((r) => r.status === "rejected").length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              type="text"
              placeholder="ابحث عن طلب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-right"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">معلق</option>
              <option value="approved">موافق عليه</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
          >
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-600 font-tajawal text-sm">{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="mr-auto text-red-600 hover:text-red-800"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
          <span className="mr-3 font-tajawal text-gray-600">
            جاري التحميل...
          </span>
        </div>
      )}

      {/* Requests Grid */}
      {!loading && filteredRequests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={18} className="text-primary" />
                      <h3 className="text-lg font-reem font-bold text-gray-800">
                        طلب #{request.id}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User size={16} />
                        <span className="font-tajawal text-sm">
                          المستخدم: {getUserName(request.user)}
                        </span>
                      </div>
                      {request.customization ? (
                        // Show customization data
                        (() => {
                          const customization = getCustomization(
                            request.customization
                          );
                          if (customization) {
                            // Get book price from books array using book_id
                            const book = books.find(
                              (b) => b.id === customization.book_id
                            );
                            const price = book ? book.price : null;

                            return (
                              <>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <BookOpen size={16} />
                                  <span className="font-tajawal text-sm">
                                    الكتاب: {customization.book_title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-primary">
                                  <span className="font-tajawal text-sm font-semibold">
                                    تخصيص: {customization.child_name}
                                  </span>
                                </div>
                                {price != null && (
                                  <div className="flex items-center gap-2 text-green-600">
                                    <span className="font-tajawal text-sm font-semibold">
                                      السعر: ${(Number(price) || 0).toFixed(2)}
                                    </span>
                                  </div>
                                )}
                              </>
                            );
                          }
                          return null;
                        })()
                      ) : request.book ? (
                        // Show regular book data (when book is not null)
                        <>
                          <div className="flex items-center gap-2 text-gray-600">
                            <BookOpen size={16} />
                            <span className="font-tajawal text-sm">
                              الكتاب: {getBookName(request.book)}
                            </span>
                          </div>
                          {getBookPrice(request.book) != null && (
                            <div className="flex items-center gap-2 text-green-600">
                              <span className="font-tajawal text-sm font-semibold">
                                السعر: $
                                {(
                                  Number(getBookPrice(request.book)) || 0
                                ).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </>
                      ) : null}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span className="font-tajawal text-xs">
                          {formatDate(request.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-tajawal font-semibold ${
                      statusColors[request.status]
                    }`}
                  >
                    {statusLabels[request.status]}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRequest(request)}
                    className="flex-1"
                    icon={<Eye size={16} />}
                  >
                    عرض التفاصيل
                  </Button>
                  {request.status === "pending" && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          handleProcessRequest(request.id, "approve")
                        }
                        disabled={processRequestLoading}
                        className="flex-1"
                        icon={
                          processRequestLoading ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <CheckCircle size={16} />
                          )
                        }
                      >
                        موافقة
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleProcessRequest(request.id, "reject")
                        }
                        disabled={processRequestLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        icon={
                          processRequestLoading ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <XCircle size={16} />
                          )
                        }
                      >
                        رفض
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRequests.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-gray-400" size={24} />
          </div>
          <p className="font-tajawal text-gray-600 text-lg">
            {searchTerm || statusFilter !== "all"
              ? "لم يتم العثور على طلبات"
              : "لا توجد طلبات حالياً"}
          </p>
        </Card>
      )}

      {/* Request Details Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-reem font-bold text-gray-800">
                  تفاصيل الطلب #{selectedRequest.id}
                </h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-reem font-semibold text-gray-700 mb-2">
                    معلومات الطلب
                  </h3>
                  <div className="space-y-2">
                    <p className="font-tajawal text-gray-800">
                      <span className="font-semibold">رقم الطلب:</span> #
                      {selectedRequest.id}
                    </p>
                    <p className="font-tajawal text-gray-800">
                      <span className="font-semibold">المستخدم:</span>{" "}
                      {getUserName(selectedRequest.user)}
                    </p>
                    {selectedRequest.customization ? (
                      // Show customization data
                      (() => {
                        const customization = getCustomization(
                          selectedRequest.customization
                        );
                        if (customization) {
                          // Get book price from books array using book_id
                          const book = books.find(
                            (b) => b.id === customization.book_id
                          );
                          const price = book ? book.price : null;

                          return (
                            <>
                              <p className="font-tajawal text-gray-800">
                                <span className="font-semibold">الكتاب:</span>{" "}
                                {customization.book_title}
                              </p>
                              <p className="font-tajawal text-primary">
                                <span className="font-semibold">التخصيص:</span>{" "}
                                {customization.child_name}
                                <span className="text-gray-500 text-xs mr-2">
                                  (ID: #{selectedRequest.customization})
                                </span>
                              </p>
                              {price != null && (
                                <p className="font-tajawal text-green-600">
                                  <span className="font-semibold">السعر:</span>{" "}
                                  ${(Number(price) || 0).toFixed(2)}
                                </p>
                              )}
                            </>
                          );
                        }
                        return (
                          <p className="font-tajawal text-gray-800">
                            <span className="font-semibold">الكتاب:</span>{" "}
                            {selectedRequest.book
                              ? getBookName(selectedRequest.book)
                              : "غير متاح"}
                            <span className="text-gray-500 text-xs mr-2">
                              (التخصيص غير متاح)
                            </span>
                          </p>
                        );
                      })()
                    ) : selectedRequest.book ? (
                      // Show regular book data (when book is not null)
                      <>
                        <p className="font-tajawal text-gray-800">
                          <span className="font-semibold">الكتاب:</span>{" "}
                          {getBookName(selectedRequest.book)}
                        </p>
                        {getBookPrice(selectedRequest.book) != null && (
                          <p className="font-tajawal text-green-600">
                            <span className="font-semibold">السعر:</span> $
                            {(
                              Number(getBookPrice(selectedRequest.book)) || 0
                            ).toFixed(2)}
                          </p>
                        )}
                      </>
                    ) : null}
                    {(() => {
                      const user = allUsers.find(
                        (u) => u.id === selectedRequest.user
                      );
                      return (
                        <>
                          {user?.phone && (
                            <p className="font-tajawal text-gray-800">
                              <span className="font-semibold">رقم الهاتف:</span>{" "}
                              <span className="text-gray-600">
                                {user.phone}
                              </span>
                            </p>
                          )}
                          {user?.address && (
                            <p className="font-tajawal text-gray-800">
                              <span className="font-semibold">العنوان:</span>{" "}
                              <span className="text-gray-600">
                                {user.address}
                              </span>
                            </p>
                          )}
                        </>
                      );
                    })()}
                    <p className="font-tajawal text-gray-600">
                      <span className="font-semibold">الحالة:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          statusColors[selectedRequest.status]
                        }`}
                      >
                        {statusLabels[selectedRequest.status]}
                      </span>
                    </p>
                    <p className="font-tajawal text-gray-600">
                      <span className="font-semibold">التاريخ:</span>{" "}
                      {formatDate(selectedRequest.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedRequest.status === "pending" && (
                <div className="flex gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1"
                    icon={<X size={16} />}
                  >
                    إلغاء
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleProcessRequest(selectedRequest.id, "approve")
                    }
                    disabled={processRequestLoading}
                    className="flex-1"
                    icon={
                      processRequestLoading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )
                    }
                  >
                    موافقة
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      handleProcessRequest(selectedRequest.id, "reject")
                    }
                    disabled={processRequestLoading}
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    icon={
                      processRequestLoading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <XCircle size={16} />
                      )
                    }
                  >
                    رفض
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
