import { Check, X } from "lucide-react";

const comparisons = [
  {
    feature: "Daily limit",
    pickrack: true,
    smallpdf: false,
    ilovepdf: false,
  },
  {
    feature: "Signup required",
    pickrack: false,
    smallpdf: true,
    ilovepdf: true,
  },
  {
    feature: "Privacy (browser-side)",
    pickrack: true,
    smallpdf: false,
    ilovepdf: false,
  },
  {
    feature: "No watermark",
    pickrack: true,
    smallpdf: false,
    ilovepdf: false,
  },
];

export default function ComparisonTable() {
  return (
    <section className="py-12 border-t" style={{ borderColor: "var(--color-border)" }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Why Pickrack stands out</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--color-border)" }}>
                <th className="text-left font-semibold text-gray-900 px-4 py-3">Feature</th>
                <th className="text-center font-semibold text-emerald-700 px-4 py-3">Pickrack</th>
                <th className="text-center font-semibold text-gray-600 px-4 py-3">Smallpdf</th>
                <th className="text-center font-semibold text-gray-600 px-4 py-3">iLovePDF</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, idx) => (
                <tr key={idx} className="border-b" style={{ borderColor: "var(--color-border)" }}>
                  <td className="font-medium text-gray-900 px-4 py-4">{row.feature}</td>
                  <td className="text-center px-4 py-4">
                    {row.pickrack ? (
                      <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="text-center px-4 py-4">
                    {row.smallpdf ? (
                      <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="text-center px-4 py-4">
                    {row.ilovepdf ? (
                      <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-600 text-center mt-6">
          Compare more details in our full reviews:{" "}
          <a href="/blog/pickrack-vs-smallpdf-2026/" className="text-emerald-600 hover:underline">
            Pickrack vs Smallpdf
          </a>{" "}
          and{" "}
          <a href="/blog/pickrack-vs-ilovepdf-2026/" className="text-emerald-600 hover:underline">
            Pickrack vs iLovePDF
          </a>
          .
        </p>
      </div>
    </section>
  );
}
