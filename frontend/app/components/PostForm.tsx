"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface PostFormValues {
  title: string;
  description: string;
  githubLink: string;
  demoLink: string;
  screenshots: string[];
  tags: string[];
}

interface PostFormProps {
  initialValues?: Partial<PostFormValues>;
  onSubmit: (data: PostFormValues) => Promise<void>;
  submitLabel?: string;
}

type TextFields = Pick<PostFormValues, "title" | "description" | "githubLink" | "demoLink">;

export default function PostForm({
  initialValues = {},
  onSubmit,
  submitLabel = "Publish Project",
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TextFields>({
    defaultValues: {
      title: initialValues.title ?? "",
      description: initialValues.description ?? "",
      githubLink: initialValues.githubLink ?? "",
      demoLink: initialValues.demoLink ?? "",
    },
  });

  const [tags, setTags] = useState<string[]>(initialValues.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  const [screenshots, setScreenshots] = useState<string[]>(initialValues.screenshots ?? []);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  function addTag() {
    const trimmed = tagInput.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploadError("");
    setUploadingCount(files.length);

    const uploaded: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`${BACKEND_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error ?? "Upload failed");
        }

        const { url } = await res.json();
        uploaded.push(url);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setUploadError(message);
      }
    }

    setScreenshots((prev) => [...prev, ...uploaded]);
    setUploadingCount(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeScreenshot(url: string) {
    setScreenshots((prev) => prev.filter((s) => s !== url));
  }

  async function handleSubmit_(data: TextFields) {
    setSubmitError("");
    try {
      await onSubmit({
        title: data.title,
        description: data.description,
        githubLink: data.githubLink,
        demoLink: data.demoLink,
        screenshots,
        tags,
      });
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmit_)} noValidate className="space-y-6">

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. My Expense Tracker App"
          className={`w-full rounded-lg border px-4 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.title ? "border-red-400" : "border-gray-300"
          }`}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          placeholder="What did you build? What problem does it solve?"
          className={`w-full rounded-lg border px-4 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
            errors.description ? "border-red-400" : "border-gray-300"
          }`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* GitHub Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          GitHub Repo Link
        </label>
        <input
          type="url"
          placeholder="https://github.com/you/project"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...register("githubLink", {
            pattern: { value: /^https?:\/\/.+/, message: "Must be a valid URL" },
          })}
        />
        {errors.githubLink && (
          <p className="mt-1 text-xs text-red-500">{errors.githubLink.message}</p>
        )}
      </div>

      {/* Demo Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Demo Link
        </label>
        <input
          type="url"
          placeholder="https://your-demo.com"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...register("demoLink", {
            pattern: { value: /^https?:\/\/.+/, message: "Must be a valid URL" },
          })}
        />
        {errors.demoLink && (
          <p className="mt-1 text-xs text-red-500">{errors.demoLink.message}</p>
        )}
      </div>

      {/* Tech Stack Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tech Stack Tags
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); addTag(); }
            }}
            placeholder="e.g. React — press Enter to add"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={addTag}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-indigo-400 hover:text-indigo-700"
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Screenshots */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Screenshots
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingCount > 0}
          className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition-colors w-full disabled:opacity-50"
        >
          {uploadingCount > 0
            ? `Uploading ${uploadingCount} file(s)...`
            : "Click to upload screenshots (JPEG, PNG, WEBP, GIF)"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        {uploadError && (
          <p className="mt-1 text-xs text-red-500">{uploadError}</p>
        )}
        {screenshots.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {screenshots.map((url) => (
              <div key={url} className="relative group rounded-lg overflow-hidden aspect-video bg-gray-100">
                <Image src={url} alt="Screenshot preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeScreenshot(url)}
                  className="absolute top-1 right-1 rounded-full bg-black/60 text-white text-xs px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove screenshot"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit error */}
      {submitError && (
        <p className="text-sm text-red-500 text-center">{submitError}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || uploadingCount > 0}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
