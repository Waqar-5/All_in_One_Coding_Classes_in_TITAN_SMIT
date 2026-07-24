import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSave, FiLock, FiCalendar, FiBookOpen, FiRepeat, FiCheckCircle } from "react-icons/fi";
import FormInput from "../components/FormInput";
import ImageUpload from "../components/ImageUpload";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import PageTransition from "../components/PageTransition";
import { getMyProfile, updateProfile, changePassword } from "../api/auth";
import { getImageUrl } from "../utils/image";
import { formatDate } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";

const STAT_ITEMS = [
  { key: "booksListed", label: "Books Listed", icon: FiBookOpen },
  { key: "booksExchanged", label: "Books Exchanged", icon: FiRepeat },
  { key: "exchangesCompleted", label: "Exchanges Completed", icon: FiCheckCircle },
];

export default function Profile() {
  const { updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [progress, setProgress] = useState(null);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyProfile();
      setProfile(data.user);
      setStats(data.stats);
      setForm({
        name: data.user.name || "",
        phone: data.user.phone || "",
        city: data.user.city || "",
        bio: data.user.bio || "",
      });
      setExistingAvatarUrl(getImageUrl(data.user.profileImage));
      setAvatarFile(null);
      setAvatarRemoved(false);
    } catch (err) {
      setError(err.message || "Couldn't load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleAvatarSelect = (file) => {
    setAvatarFile(file);
    setAvatarRemoved(false);
  };

  const handleRemoveAvatar = () => {
    setExistingAvatarUrl(null);
    setAvatarRemoved(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProgress(0);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (avatarFile) formData.append("profileImage", avatarFile);
      else if (avatarRemoved) formData.append("removeImage", "true");

      const updated = await updateProfile(formData, setProgress);
      updateUser(updated);
      toast.success("Profile updated.");
      fetchProfile();
    } catch (err) {
      toast.error(err.message || "Couldn't update your profile.");
    } finally {
      setSavingProfile(false);
      setProgress(null);
    }
  };

  const handlePwChange = (field) => (e) => {
    setPwForm((f) => ({ ...f, [field]: e.target.value }));
    if (pwErrors[field]) setPwErrors((er) => ({ ...er, [field]: undefined }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!pwForm.currentPassword) errors.currentPassword = "Required.";
    if (!pwForm.newPassword) errors.newPassword = "Required.";
    else if (pwForm.newPassword.length < 6) errors.newPassword = "Must be at least 6 characters.";
    if (pwForm.confirmPassword !== pwForm.newPassword) errors.confirmPassword = "Passwords don't match.";

    if (Object.keys(errors).length > 0) {
      setPwErrors(errors);
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success("Password changed.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.message || "Couldn't change your password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-3xl px-5 py-14">
        <p className="font-mono text-xs uppercase tracking-widest text-moss-600 dark:text-brass-400">Your desk</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-ink-700 dark:text-paper-50">Library card</h1>

        {loading ? (
          <LoadingSpinner label="Loading your profile…" />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchProfile} />
        ) : (
          form && (
            <>
              {/* Stats */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {STAT_ITEMS.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-5 text-center shadow-card"
                  >
                    <item.icon className="mx-auto mb-2 text-xl text-moss-600 dark:text-brass-400" aria-hidden="true" />
                    <p className="font-display text-2xl font-medium text-ink-700 dark:text-paper-50">
                      {stats?.[item.key] ?? 0}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-ink-300 dark:text-paper-400/70">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-300 dark:text-paper-400/70 sm:justify-start">
                <FiCalendar aria-hidden="true" /> Member since {formatDate(profile.createdAt)}
              </p>

              {/* Profile details */}
              <form
                onSubmit={handleSaveProfile}
                className="mt-8 space-y-5 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-7 shadow-card"
              >
                <h2 className="font-display text-lg font-medium text-ink-700 dark:text-paper-50">Profile details</h2>

                <ImageUpload
                  file={avatarFile}
                  existingImageUrl={existingAvatarUrl}
                  onFileSelect={handleAvatarSelect}
                  onRemoveExisting={handleRemoveAvatar}
                  progress={progress}
                  label="Profile photo"
                  previewAlt="Your profile photo"
                  shape="circle"
                  heightClass="h-32"
                />

                <FormInput id="name" label="Full name" value={form.name} onChange={handleChange("name")} />
                <FormInput id="email" label="Email" value={profile.email} disabled hint="Email can't be changed." />

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput id="phone" label="Phone" placeholder="Optional" value={form.phone} onChange={handleChange("phone")} />
                  <FormInput id="city" label="City" placeholder="Optional" value={form.city} onChange={handleChange("city")} />
                </div>

                <FormInput
                  id="bio"
                  label="Bio"
                  as="textarea"
                  placeholder="A short note about you and the kinds of books you like."
                  value={form.bio}
                  onChange={handleChange("bio")}
                  hint={`${form.bio.length}/300`}
                />

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" icon={FiSave} loading={savingProfile}>
                    Save changes
                  </Button>
                </div>
              </form>

              {/* Change password */}
              <form
                onSubmit={handleChangePassword}
                className="mt-6 space-y-5 rounded-2xl border border-ink-100 dark:border-paper-400/10 bg-paper-50 dark:bg-ink-700/40 p-7 shadow-card"
              >
                <h2 className="font-display text-lg font-medium text-ink-700 dark:text-paper-50">Change password</h2>

                <FormInput
                  id="currentPassword"
                  label="Current password"
                  type="password"
                  autoComplete="current-password"
                  value={pwForm.currentPassword}
                  onChange={handlePwChange("currentPassword")}
                  error={pwErrors.currentPassword}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormInput
                    id="newPassword"
                    label="New password"
                    type="password"
                    autoComplete="new-password"
                    value={pwForm.newPassword}
                    onChange={handlePwChange("newPassword")}
                    error={pwErrors.newPassword}
                  />
                  <FormInput
                    id="confirmPassword"
                    label="Confirm new password"
                    type="password"
                    autoComplete="new-password"
                    value={pwForm.confirmPassword}
                    onChange={handlePwChange("confirmPassword")}
                    error={pwErrors.confirmPassword}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="outline" icon={FiLock} loading={savingPassword}>
                    Update password
                  </Button>
                </div>
              </form>
            </>
          )
        )}
      </section>
    </PageTransition>
  );
}
