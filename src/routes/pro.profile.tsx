import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import ConfirmModal from "../components/ConfirmModal";
import { providerProfile as seed } from "../data/providerMock";
import { useAuth } from "../context/AuthContext";

import { userApi } from "../api/userApi";
import { providerApi } from "../api/providerApi";
import { API_BASE_URL, API_PATHS } from "../utils/constants";

export const Route = createFileRoute("/pro/profile")({
  component: ProviderProfilePage,
});

function ProviderProfilePage() {
  const navigate = useNavigate();

  const { user, updateProfile, logout } = useAuth();

  // ---------------- USER FORM ----------------

  const [userForm, setUserForm] = useState({
    username: user?.username ?? "",
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
  });

  // ---------------- PROVIDER FORM ----------------

  const [providerForm, setProviderForm] = useState({
    businessName: seed.businessName,
    description: seed.description,
    experience: String(seed.experience),
  });

  const [savingUser, setSavingUser] = useState(false);
  const [savingProvider, setSavingProvider] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const setUser = (
    key: keyof typeof userForm,
    value: string
  ) => {
    setUserForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setProvider = (
    key: keyof typeof providerForm,
    value: string
  ) => {
    setProviderForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ===========================================================
  // UPDATE USER PROFILE
  // ===========================================================

  const updateUser = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!userForm.fullName.trim() || !userForm.email.trim()) {
      toast.error("Full name and email are required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(userForm.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setSavingUser(true);

    try {
      console.log("Base URL:", API_BASE_URL);
      console.log("Path:", API_PATHS.user.update);

      const updatedUser = await userApi.update(userForm);

      updateProfile(updatedUser);

      toast.success("User profile updated");
    } catch (err) {
      const networkOrNotFound =
        axios.isAxiosError(err) &&
        (!err.response || err.response.status === 404);

      if (networkOrNotFound) {
        updateProfile(userForm);
        toast.success("User profile updated (offline demo)");
        return;
      }

      console.error(err);

      if (!axios.isAxiosError(err)) {
        toast.error("Failed to update user profile");
      }
    } finally {
      setSavingUser(false);
    }
  };

  // ===========================================================
  // UPDATE PROVIDER PROFILE
  // ===========================================================

  const updateProvider = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!providerForm.businessName.trim()) {
      toast.error("Business name is required");
      return;
    }

    setSavingProvider(true);

    try {
      await providerApi.update({
        businessName: providerForm.businessName,
        description: providerForm.description,
        experience: Number(providerForm.experience),
      });

      toast.success("Provider profile updated");
    } catch (err) {
      const networkOrNotFound =
        axios.isAxiosError(err) &&
        (!err.response || err.response.status === 404);

      if (networkOrNotFound) {
        toast.success("Provider profile updated (offline demo)");
        return;
      }

      console.error(err);

      if (!axios.isAxiosError(err)) {
        toast.error("Failed to update provider profile");
      }
    } finally {
      setSavingProvider(false);
    }
  };

  // ===========================================================
  // DELETE PROVIDER
  // ===========================================================

  const onDelete = () => {
    setConfirmDelete(false);

    toast.success("Provider account deleted");

    logout();

    navigate({
      to: "/",
    });
  };

  // ===========================================================
  // LOAD PROVIDER PROFILE
  // ===========================================================

  const loadProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const [userData, providerData] = await Promise.all([
        userApi.me(userId!),
        providerApi.me(),
      ]);

      setUserForm({
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
      });

      setProviderForm({
        businessName: providerData.businessName,
        description: providerData.description,
        experience: providerData.experience,
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    }
  };

  return (
    <div className="row g-3">

      {/* ================= LEFT PROFILE CARD ================= */}

      <div className="col-lg-4">
        <div className="ssf-panel text-center">

          <div
            className="ssf-avatar mx-auto mb-3"
            style={{
              width: 96,
              height: 96,
              fontSize: "2rem",
            }}
          >
            {(userForm.fullName ||
              userForm.username ||
              "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <h5 className="mb-0">
            {userForm.fullName || userForm.username}
          </h5>

          <div className="text-secondary small">
            {userForm.email}
          </div>

          <hr />

          <div className="small text-secondary text-start">

            <div className="mb-2">
              <strong className="text-light">
                Username:
              </strong>{" "}
              {userForm.username}
            </div>

            <div className="mb-2">
              <strong className="text-light">
                Phone:
              </strong>{" "}
              {userForm.phone || "—"}
            </div>

            <div className="mb-2">
              <strong className="text-light">
                Address:
              </strong>{" "}
              {userForm.address || "—"}
            </div>

            <hr />

            <div className="small text-secondary">
              Provider ID
            </div>

            <h5>#{seed.id}</h5>

            <div className="d-flex align-items-center gap-2">

              <Star
                size={16}
                color="#fbbf24"
                fill="#fbbf24"
              />

              <span className="fw-semibold">
                {seed.rating.toFixed(1)}
              </span>

              <span className="text-secondary small">
                overall rating
              </span>

            </div>

          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}

      <div className="col-lg-8">

        {/* USER INFORMATION */}

        <div className="ssf-panel mb-3">

          <h5 className="mb-3">
            User Information
          </h5>

          <form onSubmit={updateUser}>

            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label small fw-semibold">
                  Username
                </label>

                <input
                  className="form-control"
                  value={userForm.username}
                  disabled
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">
                  Full Name
                </label>

                <input
                  className="form-control"
                  value={userForm.fullName}
                  onChange={(e) =>
                    setUser(
                      "fullName",
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="col-md-6">

                <label className="form-label small fw-semibold">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  value={userForm.email}
                  onChange={(e) =>
                    setUser(
                      "email",
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              <div className="col-md-6">

                <label className="form-label small fw-semibold">
                  Phone
                </label>

                <input
                  className="form-control"
                  value={userForm.phone}
                  onChange={(e) =>
                    setUser(
                      "phone",
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="col-12">

                <label className="form-label small fw-semibold">
                  Address
                </label>

                <textarea
                  rows={3}
                  className="form-control"
                  value={userForm.address}
                  onChange={(e) =>
                    setUser(
                      "address",
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="d-flex justify-content-end mt-3">

                <button
                  type="submit"
                  className="btn btn-ssf-primary"
                  disabled={savingUser}
                >
                  <Save
                    size={16}
                    className="me-1"
                  />

                  {savingUser
                    ? "Saving..."
                    : "Save User Changes"}
                </button>

              </div>

            </div>
          </form>
        </div>

                {/* ================= PROVIDER INFORMATION ================= */}

        <div className="ssf-panel">

          <h5 className="mb-3">
            Provider Information
          </h5>

          <form onSubmit={updateProvider}>

            <div className="mb-3">

              <label className="form-label small fw-semibold">
                Business Name
              </label>

              <input
                className="form-control"
                value={providerForm.businessName}
                onChange={(e) =>
                  setProvider("businessName", e.target.value)
                }
              />

            </div>

            <div className="mb-3">

              <label className="form-label small fw-semibold">
                Description
              </label>

              <textarea
                rows={4}
                className="form-control"
                value={providerForm.description}
                onChange={(e) =>
                  setProvider("description", e.target.value)
                }
              />

            </div>

            <div className="mb-3">

              <label className="form-label small fw-semibold">
                Experience (Years)
              </label>

              <input
                type="number"
                className="form-control"
                value={providerForm.experience}
                onChange={(e) =>
                  setProvider("experience", e.target.value)
                }
              />

            </div>

            <div className="d-flex justify-content-end">

              <button
                type="submit"
                className="btn btn-ssf-primary"
                disabled={savingProvider}
              >
                <Save
                  size={16}
                  className="me-1"
                />

                {savingProvider
                  ? "Saving..."
                  : "Save Provider Changes"}
              </button>

            </div>

          </form>

        </div>

        {/* ================= DANGER ZONE ================= */}

        <div className="ssf-panel mt-3 p-3 p-md-4">

          <h6 className="text-danger">
            Danger Zone
          </h6>

          <p className="small text-secondary mb-3">
            Deleting your provider account is permanent
            and removes all your services and bookings.
          </p>

          <button
            className="btn btn-outline-danger"
            onClick={() =>
              setConfirmDelete(true)
            }
          >
            <Trash2
              size={16}
              className="me-1"
            />

            Delete Provider Account

          </button>

        </div>

      </div>

      {/* ================= CONFIRM MODAL ================= */}

      <ConfirmModal
        open={confirmDelete}
        title="Delete provider account?"
        message="This will permanently delete your provider profile and all listings."
        confirmLabel="Delete Account"
        onConfirm={onDelete}
        onClose={() =>
          setConfirmDelete(false)
        }
      />

    </div>
  );
}