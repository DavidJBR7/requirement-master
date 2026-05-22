import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  UserCircle,
  User,
  Envelope,
  LockKey,
  ShieldCheck,
  CheckCircle,
  At,
} from "@phosphor-icons/react";

import { useAuthStore } from "../store/authStore";

import {
  getUserProfile,
  updateProfile,
  changePassword,
} from "../features/auth/services/userService";

import PasswordInput from "../shared/components/PasswordInput";

// ─────────────────────────────────────────────
// VALIDACIONES
// ─────────────────────────────────────────────

const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100 caracteres"),

  username: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres"),

  email: z.string().email("Correo inválido").max(150, "Máximo 150 caracteres"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
  })

  .refine(
    (data) => {
      if (data.newPassword || data.confirmNewPassword || data.currentPassword) {
        return !!(
          data.currentPassword &&
          data.newPassword &&
          data.confirmNewPassword
        );
      }

      return true;
    },
    {
      message: "Completa todos los campos de contraseña",
      path: ["currentPassword"],
    },
  )

  .refine(
    (data) => {
      if (!data.newPassword) return true;

      return data.newPassword.length >= 8;
    },
    {
      message: "Mínimo 8 caracteres",
      path: ["newPassword"],
    },
  )

  .refine(
    (data) => {
      if (!data.newPassword) return true;

      return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(data.newPassword);
    },
    {
      message: "Debe incluir mayúscula, número y carácter especial",
      path: ["newPassword"],
    },
  )

  .refine(
    (data) => {
      if (!data.newPassword && !data.confirmNewPassword) return true;

      return data.newPassword === data.confirmNewPassword;
    },
    {
      message: "Las contraseñas no coinciden",
      path: ["confirmNewPassword"],
    },
  );

const formSchema = profileSchema.merge(passwordSchema);

// ─────────────────────────────────────────────
// COMPONENTE
// ─────────────────────────────────────────────

export default function ProfilePage() {
  const { user, setUserProfile } = useAuthStore();

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (err) {
        setMessage({
          type: "error",
          text: "No se pudo cargar el perfil",
        });
      } finally {
        setLoading(false);
      }
    };

    if (!user || !user.email) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),

    defaultValues: {
      fullName: user?.fullName || "",
      username: user?.username || "",
      email: user?.email || "",

      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });

    setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 5000);
  };

  // ─────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────

  const onSubmit = async (data) => {
    try {
      // PERFIL
      const updatedProfile = await updateProfile({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
      });

      setUserProfile(updatedProfile);

      // PASSWORD
      if (data.newPassword) {
        await changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmNewPassword,
        });
      }

      showMessage("success", "Perfil actualizado correctamente");

      reset({
        ...data,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      const msg = error.response?.data?.message || "Ocurrió un error";

      showMessage("error", msg);
    }
  };

  // ─────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fc] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-[5px] border-blue-600 border-t-transparent animate-spin" />
      </main>
    );
  }

  // ─────────────────────────────────────────
  // NO USER
  // ─────────────────────────────────────────

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f4f8fc] flex items-center justify-center p-4">
        <section className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
          <p className="text-slate-600 text-center">Usuario no autenticado</p>
        </section>
      </main>
    );
  }

  // ─────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────

  return (
    <main
      className="
      min-h-[100dvh]
      w-full

      lg:min-h-screen
      lg:flex
      lg:items-center
      lg:justify-center
      lg:p-6
    "
    >
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
        w-full

        min-h-[100dvh]

        lg:w-full
        lg:max-w-4xl
        lg:h-[90vh]
        lg:min-h-0
      "
      >
        <article
          className="
          bg-white

          w-full
          lg:h-full

          overflow-hidden

          border
          border-slate-200

          shadow-[0_15px_60px_rgba(15,23,42,0.08)]

          rounded-none
          lg:rounded-[34px]

          flex
          flex-col
        "
        >
          {/* HEADER */}
          <header
            className="
            relative

            px-5
            sm:px-6
            md:px-10

            pt-8
            pb-24

            bg-gradient-to-br
            from-blue-600
            via-blue-500
            to-cyan-500

            shrink-0
          "
          >
            {/* Glow */}
            <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-white/10 rounded-full blur-3xl" />

            {/* USER */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div
                className="
                w-28
                h-28

                rounded-full
                bg-white/20

                backdrop-blur-md
                border
                border-white/20

                flex
                items-center
                justify-center

                shadow-2xl
              "
              >
                <UserCircle size={72} weight="fill" className="text-white" />
              </div>

              <h1 className="mt-5 text-3xl font-black text-white">
                {user.fullName}
              </h1>

              <p className="mt-2 text-blue-100">@{user.username}</p>

              <div
                className="
                mt-5

                flex
                items-center
                gap-2

                bg-white/15
                border
                border-white/10

                rounded-full

                px-4
                py-2

                backdrop-blur-md
              "
              >
                <ShieldCheck
                  size={18}
                  weight="fill"
                  className="text-emerald-300"
                />

                <span className="text-white text-sm font-semibold">
                  Cuenta protegida
                </span>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <section
            className="
            relative

            px-3
            md:px-8

            flex-1
          "
          >
            {/* FLOAT CARD */}
            <div
              className="
              -mt-14

              relative
              z-20

              bg-white

              rounded-t-[30px]
              lg:rounded-[30px]

              border
              border-slate-200

              shadow-[0_10px_40px_rgba(15,23,42,0.08)]

              h-auto

              p-5
              md:p-8
            "
            >
              {/* MESSAGE */}
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  aria-live="polite"
                  className={`
                  mb-6
                  rounded-2xl
                  px-4
                  py-3

                  flex
                  items-center
                  gap-3

                  font-semibold
                  border

                  ${
                    message.type === "error"
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }
                `}
                >
                  <CheckCircle size={20} weight="fill" />

                  <span>{message.text}</span>
                </motion.div>
              )}

              {/* TITLE */}
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900">
                  Configuración de la cuenta
                </h2>

                <p className="mt-1 text-slate-500">
                  Administra tu información y seguridad
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* PERSONAL */}
                <section aria-labelledby="personal-info-title">
                  <div className="flex items-start sm:items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                      <User size={22} weight="fill" className="text-blue-600" />
                    </div>

                    <div>
                      <h3
                        id="personal-info-title"
                        className="font-black text-slate-900"
                      >
                        Información personal
                      </h3>

                      <p className="text-sm text-slate-500">
                        Datos visibles de tu cuenta
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* FULLNAME */}
                    <div className="space-y-2">
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-bold text-slate-700"
                      >
                        Nombre completo
                      </label>

                      <div className="relative group">
                        <div
                          className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2

                          text-slate-400

                          transition-colors
                          duration-200

                          group-focus-within:text-blue-600
                        "
                        >
                          <User size={20} />
                        </div>

                        <input
                          id="fullName"
                          type="text"
                          autoComplete="name"
                          placeholder="Tu nombre completo"
                          {...register("fullName")}
                          className="
                          w-full
                          h-12

                          rounded-2xl
                          border
                          border-slate-200

                          bg-white

                          pl-12
                          pr-4

                          text-[15px]
                          text-slate-800
                          font-medium

                          shadow-sm
                          outline-none

                          transition-all
                          duration-200

                          placeholder:text-slate-400

                          hover:border-slate-300

                          focus:border-blue-500
                          focus:ring-4
                          focus:ring-blue-500/10
                        "
                        />
                      </div>

                      {errors.fullName && (
                        <motion.p
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm font-medium text-red-500 pl-1"
                        >
                          {errors.fullName.message}
                        </motion.p>
                      )}
                    </div>

                    {/* USERNAME */}
                    <div className="space-y-2">
                      <label
                        htmlFor="username"
                        className="block text-sm font-bold text-slate-700"
                      >
                        Nombre de usuario
                      </label>

                      <div className="relative group">
                        <div
                          className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2

                          text-slate-400

                          transition-colors
                          duration-200

                          group-focus-within:text-blue-600
                        "
                        >
                          <At size={20} />
                        </div>

                        <input
                          id="username"
                          type="text"
                          autoComplete="username"
                          placeholder="usuario123"
                          {...register("username")}
                          className="
                          w-full
                          h-12

                          rounded-2xl
                          border
                          border-slate-200

                          bg-white

                          pl-12
                          pr-4

                          text-[15px]
                          text-slate-800
                          font-medium

                          shadow-sm
                          outline-none

                          transition-all
                          duration-200

                          placeholder:text-slate-400

                          hover:border-slate-300

                          focus:border-blue-500
                          focus:ring-4
                          focus:ring-blue-500/10
                        "
                        />
                      </div>

                      {errors.username && (
                        <motion.p
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm font-medium text-red-500 pl-1"
                        >
                          {errors.username.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="mt-5 space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-slate-700"
                    >
                      Correo electrónico
                    </label>

                    <div className="relative group">
                      <div
                        className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2

                        text-slate-400

                        transition-colors
                        duration-200

                        group-focus-within:text-blue-600
                      "
                      >
                        <Envelope size={20} />
                      </div>

                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="correo@ejemplo.com"
                        {...register("email")}
                        className="
                        w-full
                        h-12

                        rounded-2xl
                        border
                        border-slate-200

                        bg-white

                        pl-12
                        pr-4

                        text-[15px]
                        text-slate-800
                        font-medium

                        shadow-sm
                        outline-none

                        transition-all
                        duration-200

                        placeholder:text-slate-400

                        hover:border-slate-300

                        focus:border-blue-500
                        focus:ring-4
                        focus:ring-blue-500/10
                      "
                      />
                    </div>

                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-medium text-red-500 pl-1"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>
                </section>

                {/* SECURITY */}
                <section aria-labelledby="security-title">
                  <div className="flex items-start sm:items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                      <LockKey
                        size={22}
                        weight="fill"
                        className="text-amber-600"
                      />
                    </div>

                    <div>
                      <h3
                        id="security-title"
                        className="font-black text-slate-900"
                      >
                        Seguridad
                      </h3>

                      <p className="text-sm text-slate-500">
                        Cambia tu contraseña si lo deseas
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* CURRENT PASSWORD */}
                    <div className="space-y-2">
                      <PasswordInput
                        label="Contraseña actual"
                        autoComplete="current-password"
                        {...register("currentPassword")}
                        className="
                        w-full
                        h-12

                        rounded-2xl
                        border
                        border-slate-200

                        bg-white
                        px-4

                        text-[15px]
                        text-slate-800
                        font-medium

                        shadow-sm
                        outline-none

                        transition-all
                        duration-200

                        placeholder:text-slate-400

                        hover:border-slate-300

                        focus:border-amber-500
                        focus:ring-4
                        focus:ring-amber-500/10
                      "
                      />

                      {errors.currentPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm font-medium text-red-500 pl-1"
                        >
                          {errors.currentPassword.message}
                        </motion.p>
                      )}
                    </div>

                    {/* NEW PASSWORD */}
                    <div className="space-y-2">
                      <PasswordInput
                        label="Nueva contraseña"
                        autoComplete="new-password"
                        {...register("newPassword")}
                        className="
                        w-full
                        h-12

                        rounded-2xl
                        border
                        border-slate-200

                        bg-white
                        px-4

                        text-[15px]
                        text-slate-800
                        font-medium

                        shadow-sm
                        outline-none

                        transition-all
                        duration-200

                        placeholder:text-slate-400

                        hover:border-slate-300

                        focus:border-amber-500
                        focus:ring-4
                        focus:ring-amber-500/10
                      "
                      />

                      {errors.newPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm font-medium text-red-500 pl-1"
                        >
                          {errors.newPassword.message}
                        </motion.p>
                      )}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="space-y-2">
                      <PasswordInput
                        label="Confirmar nueva contraseña"
                        autoComplete="new-password"
                        {...register("confirmNewPassword")}
                        className="
                        w-full
                        h-12

                        rounded-2xl
                        border
                        border-slate-200

                        bg-white
                        px-4

                        text-[15px]
                        text-slate-800
                        font-medium

                        shadow-sm
                        outline-none

                        transition-all
                        duration-200

                        placeholder:text-slate-400

                        hover:border-slate-300

                        focus:border-amber-500
                        focus:ring-4
                        focus:ring-amber-500/10
                      "
                      />

                      {errors.confirmNewPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm font-medium text-red-500 pl-1"
                        >
                          {errors.confirmNewPassword.message}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </section>

                {/* BUTTON */}
                <footer className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                    group
                    relative

                    w-full
                    h-12

                    overflow-hidden
                    rounded-2xl

                    bg-gradient-to-r
                    from-blue-600
                    via-blue-500
                    to-cyan-500

                    px-6

                    font-bold
                    text-white
                    text-[15px]

                    shadow-[0_10px_30px_rgba(37,99,235,0.35)]

                    transition-all
                    duration-300

                    hover:scale-[1.01]
                    hover:shadow-[0_15px_40px_rgba(37,99,235,0.45)]

                    active:scale-[0.985]

                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    disabled:hover:scale-100

                    cursor-pointer
                  "
                  >
                    {/* Shine */}
                    <div
                      className="
                      absolute
                      inset-0

                      bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.22),transparent)]

                      translate-x-[-120%]
                      group-hover:translate-x-[120%]

                      transition-transform
                      duration-1000
                    "
                    />

                    {/* Content */}
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <div
                            className="
                            w-5
                            h-5
                            rounded-full
                            border-2
                            border-white/40
                            border-t-white
                            animate-spin
                          "
                          />

                          <span>Guardando cambios...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle
                            size={20}
                            weight="fill"
                            className="transition-transform duration-300 group-hover:scale-110"
                          />

                          <span>Guardar cambios</span>
                        </>
                      )}
                    </div>
                  </button>
                </footer>
              </form>
            </div>
          </section>
        </article>
      </motion.section>
    </main>
  );
}
