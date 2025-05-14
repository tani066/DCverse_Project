
import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [avatars, setAvatars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    fetch("https://reqres.in/api/users?page=1")
      .then((res) => res.json())
      .then((data) => setAvatars(data.data.slice(0, 3)));
  }, []);

  const handleAddOrUpdateAvatar = (e) => {
    e.preventDefault();
    const nameParts = newName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";
    const image = newImage || "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=";

    if (isEditMode) {
      setAvatars((prev) =>
        prev.map((avatar) =>
          avatar.id === editId
            ? { ...avatar, first_name: firstName, last_name: lastName, avatar: image }
            : avatar
        )
      );
    } else {
      const newAvatar = {
        id: Date.now(),
        first_name: firstName,
        last_name: lastName,
        avatar: image,
      };
      setAvatars((prev) => [...prev, newAvatar]);
    }

    setNewName("");
    setNewImage("");
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
  };

  const openEditModal = (avatar) => {
    setNewName(`${avatar.first_name} ${avatar.last_name || ""}`.trim());
    setNewImage(avatar.avatar);
    setEditId(avatar.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <header className="text-center py-10">
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome back, Admin!
        </motion.h1>
        <motion.p
          className="text-gray-600 text-lg sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Manage your avatars with ease ✨
        </motion.p>
      </header>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        <AnimatePresence>
          {avatars.length === 0 ? (
            <motion.div
              className="col-span-full text-center text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No avatars yet. Add your first one!
            </motion.div>
          ) : (
            avatars.map((avatar) => (
              <motion.div
                key={avatar.id}
                className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition transform hover:scale-105 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={avatar.avatar}
                  alt={avatar.first_name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto border-4 border-indigo-300 object-cover"
                />
                <h2 className="mt-4 font-semibold text-xl text-gray-800">
                  {avatar.first_name} {avatar.last_name || ""}
                </h2>
                <button
                  onClick={() => openEditModal(avatar)}
                  className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-5 py-2 rounded-full shadow-lg transition"
                >
                  ✏️ Edit
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={() => {
          setIsModalOpen(true);
          setNewName("");
          setNewImage("");
          setIsEditMode(false);
        }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-full p-5 text-xl shadow-xl transition-transform transform hover:scale-110"
      >
        ＋
      </button>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl space-y-6 transition-all">
                  <Dialog.Title className="text-2xl font-bold text-gray-800">
                    {isEditMode ? "Edit Avatar" : "Create New Avatar"}
                  </Dialog.Title>
                  <form onSubmit={handleAddOrUpdateAvatar} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Image URL (optional)</label>
                      <input
                        type="url"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                    <div className="text-right">
                      <button
                        type="submit"
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md transition"
                      >
                        {isEditMode ? "Update" : "Add"} Avatar
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
