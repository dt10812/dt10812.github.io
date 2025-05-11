import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const InfoPanel = ({ onClose }) => {
  return (
    <Card className="max-w-3xl mx-4 p-6 bg-background text-foreground overflow-y-auto max-h-[90vh]">
      <h2 className="text-2xl font-bold mb-4">
        The Science of Atmospheric Electricity Harvesting
      </h2>

      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-2">How Does It Work?</h3>
          <p className="mb-2">
            Atmospheric electricity harvesting is a promising renewable energy
            technology that captures electricity directly from the air's
            humidity. This is how the process works:
          </p>
          <ul className="list-disc ml-5 space-y-2">
            <li>
              <strong>Water Molecules in Air:</strong> The atmosphere contains
              water vapor (H₂O molecules). These molecules carry a natural
              electrical charge due to their polar structure.
            </li>
            <li>
              <strong>Collection Process:</strong> Special materials with
              nanopores or hygroscopic surfaces attract and capture these water
              molecules from the surrounding air.
            </li>
            <li>
              <strong>Charge Separation:</strong> As water molecules interact
              with these materials, they create a potential difference (voltage)
              through various mechanisms such as contact electrification.
            </li>
            <li>
              <strong>Electricity Generation:</strong> This voltage difference
              drives electrons to flow, creating usable electrical current that
              can be harvested.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">
            Real-World Applications
          </h3>
          <p className="mb-2">
            This technology has several promising applications:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Powering small sensors and IoT devices in remote locations</li>
            <li>Supplementary power for homes in humid environments</li>
            <li>Emergency power in disaster situations</li>
            <li>Sustainable power generation in developing regions</li>
            <li>Reducing dependency on battery-powered devices</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Scientific Principles</h3>
          <p className="mb-2">
            The science behind atmospheric electricity harvesting involves
            several key principles:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>Triboelectric Effect:</strong> The generation of electric
              charge from contact between different materials
            </li>
            <li>
              <strong>Hygroscopic Properties:</strong> The ability of materials
              to attract and hold water molecules
            </li>
            <li>
              <strong>Electrochemistry:</strong> Chemical reactions that produce
              electrical energy
            </li>
            <li>
              <strong>Surface Physics:</strong> How the unique properties of
              material surfaces interact with water molecules
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Current Research</h3>
          <p>
            Scientists are developing new materials like protein nanowires,
            specialized meshes, and hydrogels that can efficiently capture
            atmospheric moisture and convert it to electricity. Recent
            prototypes have demonstrated the ability to generate small but
            continuous amounts of electricity even in low-humidity conditions,
            showing the technology's potential for widespread application.
          </p>
        </section>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Card>
  )
}
