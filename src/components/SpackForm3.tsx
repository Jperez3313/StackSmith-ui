"use client";

import React, { useState } from "react";

const [variants, setVariants] = useState<string[]>([]);

interface PackageSpec {
  name: string;
  version?: string;
  variants?: string;
  compiler?: string;
}

export default function SpackForm() {
  const [compiler, setCompiler] = useState("");
  const [specs, setSpecs] = useState<PackageSpec[]>([
    { name: "", version: "", variants: "", compiler: "" },
  ]);
  const [resultYaml, setResultYaml] = useState("");

  function addPackage() {
    setSpecs([...specs, { name: "", version: "", variants: "", compiler: "" }]);
  }

  function updatePackage(
    index: number,
    field: keyof PackageSpec,
    value: string,
  ) {
    const newSpecs = specs.slice();
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const filteredSpecs = specs.filter((p) => p.name.trim() !== "");

    const payload = {
      specs: filteredSpecs.map(({ name, version, variants, compiler }) => ({
        name,
        version: version || undefined,
        variants: variants || undefined,
        compiler: compiler || undefined,
      })),
      compiler,
      if (field === "name") {
        try {
          const res = await fetch(`http://localhost:8001/variants/${value}`);
          const data = await res.json();
          setVariants(data.variants);
        } catch (err)
          console.error("Failed to fetch variants:", err)
          setVariants([]);
      }
    };

    try {
      const res = await fetch("http://localhost:8001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResultYaml(data.spack_yaml);
    } catch (err) {
      console.error("Error:", err);
      setResultYaml("Failed to fetch YAML from backend.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Compiler Input */}
      <div>
        <label className="block font-semibold mb-1">Global Compiler</label>
        <input
          type="text"
          value={compiler}
          onChange={(e) => setCompiler(e.target.value)}
          placeholder="e.g. gcc"
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Package Inputs */}
      <div>
        <h2 className="font-semibold mb-2">Packages</h2>
        {specs.map((pkg, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-2 mb-2 items-center border-b pb-2"
          >
            <input
              type="text"
              placeholder="Package name"
              value={pkg.name}
              onChange={(e) => updatePackage(i, "name", e.target.value)}
              required
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              placeholder="Version"
              value={pkg.version}
              onChange={(e) => updatePackage(i, "version", e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <select
              value={pkg.variants}
              onChange={(e) => updatePackage(i, "variants", e.target.value)}
              className="border p-2 rounded"
            >
             <option value="">-- Select a Variant --</option>
             {variants.map((variant) => (
                <option key={variant} value={+${variant}}>
                  +{variant}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Compiler"
              value={pkg.compiler}
              onChange={(e) => updatePackage(i, "compiler", e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addPackage}
          className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
        >
          + Add Package
        </button>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded font-semibold"
      >
        Generate Spack YAML
      </button>

      {resultYaml && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Generated Spack YAML</h3>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {resultYaml}
          </pre>
        </div>
      )}
    </form>
  );
}
