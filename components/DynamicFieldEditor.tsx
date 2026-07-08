"use client";

import { useRef, useCallback } from "react";
import { compressImage } from "@/lib/compressImage";
import { enhanceImage } from "@/lib/enhanceImage";
import type { EditableField } from "@/lib/types";

type DynamicFieldEditorProps = {
  fields: EditableField[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  errors?: Record<string, string>;
};

export function DynamicFieldEditor({
  fields,
  values,
  onChange,
  errors = {},
}: DynamicFieldEditorProps) {
  if (!fields || fields.length === 0) return null;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {fields.map((field) => {
        const isFullWidth =
          field.type === "textarea" ||
          (field.type === "image" && (field.imageCount ?? 1) > 1);

        return (
          <div key={field.key} className={isFullWidth ? "md:col-span-2" : ""}>
            {field.type === "image" ? (
              <ImageField
                field={field}
                value={values[field.key]}
                onChange={(val) => onChange(field.key, val)}
                error={errors[field.key]}
              />
            ) : (
              <FieldRenderer
                field={field}
                value={values[field.key]}
                onChange={(val) => onChange(field.key, val)}
                error={errors[field.key]}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
  error,
}: {
  field: EditableField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}) {
  const inputClass = `input ${error ? "border-rose-400/50" : ""}`;

  switch (field.type) {
    case "text":
    case "password": {
      const isPassword = field.type === "password";
      return (
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-bold text-white/90">
            {field.label}
            {field.required && <span className="ml-1 text-rose-300">*</span>}
          </span>
          <input
            type={isPassword ? "password" : "text"}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className={inputClass}
          />
          {error && (
            <p className="mt-1 text-xs font-bold text-rose-300">{error}</p>
          )}
          {field.helpText && !error && (
            <p className="mt-1 text-xs text-white/40">{field.helpText}</p>
          )}
        </label>
      );
    }

    case "textarea":
      return (
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-bold text-white/90">
            {field.label}
            {field.required && <span className="ml-1 text-rose-300">*</span>}
          </span>
          <textarea
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className={`${inputClass} min-h-28 py-3`}
          />
          {error && (
            <p className="mt-1 text-xs font-bold text-rose-300">{error}</p>
          )}
          {field.helpText && !error && (
            <p className="mt-1 text-xs text-white/40">{field.helpText}</p>
          )}
        </label>
      );

    case "date":
    case "time":
      return (
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-bold text-white/90">
            {field.label}
          </span>
          <input
            type={field.type}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
          {field.helpText && (
            <p className="mt-1 text-xs text-white/40">{field.helpText}</p>
          )}
        </label>
      );

    case "number":
      return (
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-bold text-white/90">
            {field.label}
          </span>
          <input
            type="number"
            value={value ?? ""}
            onChange={(e) =>
              onChange(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder={field.placeholder}
            className={inputClass}
          />
          {field.helpText && (
            <p className="mt-1 text-xs text-white/40">{field.helpText}</p>
          )}
        </label>
      );

    case "color":
      return (
        <label className="grid min-w-0 gap-2">
          <span className="text-sm font-bold text-white/90">
            {field.label}
          </span>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={value ?? "#ff5fb7"}
              onChange={(e) => onChange(e.target.value)}
              className="h-10 w-16 cursor-pointer rounded-xl border border-white/15 bg-transparent"
            />
            <span className="text-sm text-white/60">
              {value ?? "#ff5fb7"}
            </span>
          </div>
          {field.helpText && (
            <p className="mt-1 text-xs text-white/40">{field.helpText}</p>
          )}
        </label>
      );

    default:
      return null;
  }
}

function ImageField({
  field,
  value,
  onChange,
  error,
}: {
  field: EditableField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}) {
  const count = field.imageCount ?? 1;
  const images: string[] = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

  const updateImage = useCallback(
    (index: number, dataUrl: string | null) => {
      if (count === 1) {
        onChange(dataUrl ?? "");
        return;
      }
      const next = [...images];
      if (dataUrl) {
        next[index] = dataUrl;
      } else {
        next.splice(index, 1);
      }
      onChange(next.filter(Boolean));
    },
    [count, images, onChange],
  );

  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-sm font-bold text-white/90">
        {field.label}
        {field.required && <span className="ml-1 text-rose-300">*</span>}
      </span>
      <div
        className={`grid gap-4 ${count === 1 ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"}`}
      >
        {Array.from({ length: count }).map((_, i) => (
          <ImageSlot
            key={i}
            image={images[i]}
            index={i}
            onUpdate={updateImage}
          />
        ))}
      </div>
      {error && (
        <p className="mt-1 text-xs font-bold text-rose-300">{error}</p>
      )}
      {field.helpText && !error && (
        <p className="mt-1 text-xs text-white/40">{field.helpText}</p>
      )}
    </label>
  );
}

function ImageSlot({
  image,
  index,
  onUpdate,
}: {
  image: string | undefined;
  index: number;
  onUpdate: (index: number, dataUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (image) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/15">
        <img
          src={image}
          alt={`Upload ${index + 1}`}
          className="h-32 w-full object-cover"
        />
        <button
          type="button"
          onClick={() => onUpdate(index, null)}
          className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-xs text-white/70 hover:text-white"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.04] text-xs text-white/40 transition-colors hover:border-white/30 hover:bg-white/[0.08]">
      <span className="mb-1 text-lg">📷</span>
      <span>Upload photo</span>
      <span className="mt-0.5 text-[10px] text-white/30">max 2MB</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 2 * 1024 * 1024) return;
          const reader = new FileReader();
          reader.onload = async (ev) => {
            const dataUrl = ev.target?.result as string;
            const compressed = await compressImage(dataUrl);
            const enhanced = await enhanceImage(compressed);
            onUpdate(index, enhanced);
          };
          reader.readAsDataURL(file);
          e.target.value = "";
        }}
      />
    </label>
  );
}
