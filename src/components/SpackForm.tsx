"use client";
import { useState } from "react";

interface PackageSpec {
  name: string;
  version: string;
  variants: string;
  compiler: string;
}

export default function SpackForm() {
  const [compiler, setCompiler] = useState("gcc");
  const [specs, setSpecs] = useState<PackageSpec[]>([
    { name: "", version: "", variants: "", compiler: "" },
  ]);
  const [resultYaml, setResultYaml] = useState<string>("");

  // Add a new empty package row
  function addPackage() {
    setSpecs([...specs, { name: "", version: "", variants: "", compiler: "" }]);
  }

  // Remove package
  function removePackage(index: number) {
    setSpecs(specs.filter((_, i) => i !== index));
  }

  // Update package fields by index
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

    // Filter out empty package names
    const filteredSpecs = specs.filter((p) => p.name.trim() !== "");

    const payload = {
      specs: filteredSpecs.map(({ name, version, variants, compiler }) => ({
        name,
        version: version || undefined,
        variants: variants || undefined,
        compiler: compiler || undefined,
      })),
      compiler,
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
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Global Compiler</h2>
        <input
          type="text"
          value={compiler}
          onChange={(e) => setCompiler(e.target.value)}
          placeholder="e.g. gcc"
          required
        />

        <h2>Packages</h2>
        {specs.map((pkg, i) => (
          <div
            key={i}
            style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc" }}
          >
            <input
              type="text"
              placeholder="Package name"
              value={pkg.name}
              onChange={(e) => updatePackage(i, "name", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Version (optional)"
              value={pkg.version}
              onChange={(e) => updatePackage(i, "version", e.target.value)}
            />
            <input
              type="text"
              placeholder="Variants (optional, e.g. +mpi)"
              value={pkg.variants}
              onChange={(e) => updatePackage(i, "variants", e.target.value)}
            />
            <input
              type="text"
              placeholder="Compiler (optional)"
              value={pkg.compiler}
              onChange={(e) => updatePackage(i, "compiler", e.target.value)}
            />
            <button
              type="button"
              onClick={() => removePackage(i)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addPackage}>
          Add Package
        </button>

        <br />
        <button type="submit">Generate Spack YAML</button>
      </form>

      {resultYaml && (
        <>
          <h2>Generated Spack YAML</h2>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f0f0f0",
              padding: "1rem",
              borderRadius: "4px",
              marginTop: "1rem",
            }}
          >
            {resultYaml}
          </pre>
        </>
      )}
    </div>
  );
}
