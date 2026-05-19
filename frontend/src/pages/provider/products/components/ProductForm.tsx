import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/lib/api";
import { uploadImage } from "@/lib/files";
import { TourCategory } from "@/lib/tours";
import {
  TourStatus,
  type ProviderTour,
  type WriteTourInput,
  createMyTour,
  updateMyTour,
} from "@/lib/providerTours";

const categoryOptions: { value: TourCategory; labelKey: string }[] = [
  { value: TourCategory.Adventure, labelKey: "categories.adventure" },
  { value: TourCategory.Cultural, labelKey: "categories.cultural" },
  { value: TourCategory.Gastronomic, labelKey: "categories.gastronomic" },
  { value: TourCategory.Transport, labelKey: "categories.transport" },
  { value: TourCategory.Housing, labelKey: "categories.housing" },
  { value: TourCategory.Fishing, labelKey: "categories.fishing" },
];

const locationOptions = ["La Paz", "Los Cabos", "Cabo San Lucas"];

interface ProductFormProps {
  initial?: ProviderTour;
}

export default function ProductForm({ initial }: ProductFormProps) {
  const { t } = useTranslation(["provider", "home"]);
  const navigate = useNavigate();
  const isEdit = !!initial;

  const [form, setForm] = useState<WriteTourInput>({
    title: initial?.title ?? "",
    category: initial?.category ?? TourCategory.Adventure,
    location: initial?.location ?? "La Paz",
    description: initial?.description ?? "",
    itinerary: initial?.itinerary ?? "",
    meetingPoint: initial?.meetingPoint ?? "",
    duration: initial?.duration ?? "",
    languages: initial?.languages ?? "es",
    priceAdult: initial?.priceAdult ?? 0,
    priceChild: initial?.priceChild ?? undefined,
    maxGuests: initial?.maxGuests ?? 10,
    status: initial?.status ?? TourStatus.Active,
    imageUrls: initial?.imageUrls ?? [],
  });
  const [newImageUrl, setNewImageUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof WriteTourInput>(field: K, value: WriteTourInput[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleLanguage = (lang: string) => {
    const current = form.languages.split(",").map((s) => s.trim()).filter(Boolean);
    const next = current.includes(lang) ? current.filter((l) => l !== lang) : [...current, lang];
    setField("languages", next.join(",") || "es");
  };

  const addImage = () => {
    const url = newImageUrl.trim();
    if (!url || form.imageUrls.includes(url)) return;
    setField("imageUrls", [...form.imageUrls, url]);
    setNewImageUrl("");
  };

  const handleFilePick = async (files: FileList | null) => {
    setUploadError(null);
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const f of Array.from(files)) {
        const result = await uploadImage(f);
        if (!form.imageUrls.includes(result.url) && !uploaded.includes(result.url)) {
          uploaded.push(result.url);
        }
      }
      if (uploaded.length > 0) {
        setField("imageUrls", [...form.imageUrls, ...uploaded]);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setUploadError(err.message);
      } else {
        setUploadError(t("provider:provider.uploadError", { defaultValue: "No pudimos subir la imagen." }));
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setField("imageUrls", form.imageUrls.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= form.imageUrls.length) return;
    const copy = [...form.imageUrls];
    [copy[index], copy[target]] = [copy[target]!, copy[index]!];
    setField("imageUrls", copy);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = t("provider:provider.required", { defaultValue: "Requerido" });
    if (!form.location.trim()) e.location = t("provider:provider.required", { defaultValue: "Requerido" });
    if (!form.description.trim() || form.description.trim().length < 20)
      e.description = t("provider:provider.descMin", { defaultValue: "Mínimo 20 caracteres" });
    if (!form.duration.trim()) e.duration = t("provider:provider.required", { defaultValue: "Requerido" });
    if (!form.languages.trim()) e.languages = t("provider:provider.required", { defaultValue: "Requerido" });
    if (!form.priceAdult || form.priceAdult <= 0) e.priceAdult = t("provider:provider.priceInvalid", { defaultValue: "Precio inválido" });
    if (form.priceChild !== undefined && form.priceChild < 0) e.priceChild = t("provider:provider.priceInvalid", { defaultValue: "Precio inválido" });
    if (!form.maxGuests || form.maxGuests < 1) e.maxGuests = t("provider:provider.maxGuestsMin", { defaultValue: "Al menos 1" });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setApiError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload: WriteTourInput = {
        ...form,
        title: form.title.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        itinerary: form.itinerary?.trim() || undefined,
        meetingPoint: form.meetingPoint?.trim() || undefined,
        duration: form.duration.trim(),
        priceChild: form.priceChild === undefined || (form.priceChild as number) === 0 ? undefined : Number(form.priceChild),
      };
      if (isEdit && initial) {
        await updateMyTour(initial.id, payload);
      } else {
        await createMyTour(payload);
      }
      navigate("/provider/products");
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : t("provider:provider.saveError", { defaultValue: "No pudimos guardar. Inténtalo de nuevo." }));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedLangs = form.languages.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && (
        <div className="bg-coral/10 border border-coral/30 text-coral text-sm px-4 py-3 rounded-xl">
          {apiError}
        </div>
      )}

      {/* Section: Basics */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
        <h2 className="text-base font-bold text-charcoal mb-4">{t("provider:provider.formSectionBasics", { defaultValue: "Básicos" })}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider:provider.formTitle", { defaultValue: "Título del tour" })}</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              maxLength={200}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
            />
            {errors.title && <p className="text-xs text-coral mt-1">{errors.title}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider:provider.formCategory", { defaultValue: "Categoría" })}</label>
              <select
                value={form.category}
                onChange={(e) => setField("category", Number(e.target.value) as TourCategory)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean bg-white"
              >
                {categoryOptions.map((c) => (
                  <option key={c.value} value={c.value}>{t(`home:${c.labelKey}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider:provider.formLocation", { defaultValue: "Ubicación" })}</label>
              <select
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean bg-white"
              >
                {locationOptions.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
              {errors.location && <p className="text-xs text-coral mt-1">{errors.location}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider:provider.formDesc", { defaultValue: "Descripción" })}</label>
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={5}
              maxLength={4000}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/4000</p>
            {errors.description && <p className="text-xs text-coral mt-1">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider:provider.formItinerary", { defaultValue: "Itinerario (separa pasos con ·)" })}</label>
            <textarea
              value={form.itinerary ?? ""}
              onChange={(e) => setField("itinerary", e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="8:00 Salida · 12:00 Almuerzo · 16:00 Regreso"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider:provider.formMeetingPoint", { defaultValue: "Punto de encuentro" })}</label>
              <input
                type="text"
                value={form.meetingPoint ?? ""}
                onChange={(e) => setField("meetingPoint", e.target.value)}
                maxLength={200}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider:provider.formDuration", { defaultValue: "Duración" })}</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setField("duration", e.target.value)}
                maxLength={64}
                placeholder="8 horas"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
              />
              {errors.duration && <p className="text-xs text-coral mt-1">{errors.duration}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider:provider.formLanguages", { defaultValue: "Idiomas" })}</label>
            <div className="flex gap-3">
              {[["es", "Español"], ["en", "English"]].map(([code, label]) => (
                <label key={code} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLangs.includes(code!)}
                    onChange={() => toggleLanguage(code!)}
                    className="w-4 h-4 accent-ocean"
                  />
                  <span className="text-sm text-charcoal">{label}</span>
                </label>
              ))}
            </div>
            {errors.languages && <p className="text-xs text-coral mt-1">{errors.languages}</p>}
          </div>
        </div>
      </div>

      {/* Section: Pricing & capacity */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
        <h2 className="text-base font-bold text-charcoal mb-4">{t("provider:provider.formSectionPricing", { defaultValue: "Precio y capacidad" })}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider:provider.formPriceAdult", { defaultValue: "Precio adulto (MXN)" })}</label>
            <input
              type="number"
              value={form.priceAdult || ""}
              onChange={(e) => setField("priceAdult", Number(e.target.value))}
              min={1}
              step={1}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
            />
            {errors.priceAdult && <p className="text-xs text-coral mt-1">{errors.priceAdult}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider:provider.formPriceChild", { defaultValue: "Precio niño (opcional)" })}</label>
            <input
              type="number"
              value={form.priceChild ?? ""}
              onChange={(e) => setField("priceChild", e.target.value === "" ? undefined : Number(e.target.value))}
              min={0}
              step={1}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
            />
            {errors.priceChild && <p className="text-xs text-coral mt-1">{errors.priceChild}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">{t("provider:provider.formMaxGuests", { defaultValue: "Máximo huéspedes" })}</label>
            <input
              type="number"
              value={form.maxGuests || ""}
              onChange={(e) => setField("maxGuests", Number(e.target.value))}
              min={1}
              step={1}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
            />
            {errors.maxGuests && <p className="text-xs text-coral mt-1">{errors.maxGuests}</p>}
          </div>
        </div>
      </div>

      {/* Section: Media */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
        <h2 className="text-base font-bold text-charcoal mb-4">{t("provider:provider.formSectionMedia", { defaultValue: "Imágenes" })}</h2>
        <p className="text-xs text-gray-500 mb-4">
          {t("provider:provider.formMediaHelp", { defaultValue: "Sube imágenes desde tu computadora o pega URLs. La primera será la portada. Máx 5 MB por imagen (JPG, PNG, WebP)." })}
        </p>

        {/* File upload */}
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => handleFilePick(e.target.files)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-ocean/10 text-ocean text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-ocean/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading
              ? <>
                  <div className="w-4 h-4 border-2 border-ocean/30 border-t-ocean rounded-full animate-spin" />
                  {t("provider:provider.uploading", { defaultValue: "Subiendo..." })}
                </>
              : <>
                  <i className="ri-upload-cloud-2-line" />
                  {t("provider:provider.formMediaUpload", { defaultValue: "Subir desde mi computadora" })}
                </>}
          </button>
          {uploadError && <p className="text-xs text-coral mt-2">{uploadError}</p>}
        </div>

        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">{t("provider:provider.orPasteUrl", { defaultValue: "O pega una URL" })}</p>
        <div className="flex gap-2 mb-4">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-ocean"
          />
          <button
            type="button"
            onClick={addImage}
            disabled={!newImageUrl.trim()}
            className="bg-ocean text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-ocean/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("provider:provider.formMediaAdd", { defaultValue: "Agregar" })}
          </button>
        </div>
        {form.imageUrls.length === 0 ? (
          <p className="text-xs text-gray-400 italic">{t("provider:provider.formMediaEmpty", { defaultValue: "Sin imágenes todavía." })}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {form.imageUrls.map((url, i) => (
              <div key={`${url}-${i}`} className="flex items-center gap-3 border border-gray-100 rounded-lg p-2">
                <img src={url} alt="" loading="lazy" className="w-16 h-12 object-cover rounded shrink-0" />
                <span className="text-xs text-gray-500 truncate flex-1">{url}</span>
                <div className="flex flex-col gap-1 shrink-0">
                  <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="text-xs text-gray-400 hover:text-charcoal disabled:opacity-30">
                    <i className="ri-arrow-up-line" />
                  </button>
                  <button type="button" onClick={() => moveImage(i, 1)} disabled={i === form.imageUrls.length - 1} className="text-xs text-gray-400 hover:text-charcoal disabled:opacity-30">
                    <i className="ri-arrow-down-line" />
                  </button>
                </div>
                <button type="button" onClick={() => removeImage(i)} className="text-xs text-coral hover:underline shrink-0">
                  <i className="ri-delete-bin-line" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section: Publish */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
        <h2 className="text-base font-bold text-charcoal mb-4">{t("provider:provider.formSectionPublish", { defaultValue: "Publicación" })}</h2>
        <div className="flex gap-3">
          {([
            [TourStatus.Active, "active"],
            [TourStatus.Paused, "paused"],
          ] as const).map(([val, key]) => (
            <label key={val} className={`flex-1 cursor-pointer border rounded-xl p-4 transition-colors ${form.status === val ? "border-ocean bg-ocean/5" : "border-gray-200"}`}>
              <input
                type="radio"
                name="status"
                checked={form.status === val}
                onChange={() => setField("status", val)}
                className="sr-only"
              />
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${form.status === val ? "border-ocean" : "border-gray-300"}`}>
                  {form.status === val && <div className="w-1.5 h-1.5 rounded-full bg-ocean" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">{t(`provider:provider.${key}`)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {val === TourStatus.Active
                      ? t("provider:provider.statusActiveDesc", { defaultValue: "Visible en el catálogo y aceptando reservas." })
                      : t("provider:provider.statusPausedDesc", { defaultValue: "Oculto del catálogo. Las reservas existentes no se afectan." })}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          type="button"
          onClick={() => navigate("/provider/products")}
          disabled={submitting}
          className="border border-gray-200 text-charcoal text-sm font-medium px-6 py-2.5 rounded-full hover:bg-gray-50 disabled:opacity-50"
        >
          {t("provider:provider.formCancel", { defaultValue: "Cancelar" })}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 bg-ocean text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-ocean/90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {isEdit ? t("provider:provider.formSave", { defaultValue: "Guardar cambios" }) : t("provider:provider.formPublish", { defaultValue: "Publicar tour" })}
        </button>
      </div>
    </form>
  );
}
