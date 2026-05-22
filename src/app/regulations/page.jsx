"use client";

import { useState } from "react";
import { BookOpen, ClipboardList } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  penaltySummaryRows,
  pointingSystemRows,
  ruleBookIntro,
  ruleBookSections,
} from "@/data/rule-book";

const expertColumns = [
  "Description",
  "Diesel Expert",
  "Petrol Expert",
  "Diesel Modified",
  "Petrol Modified",
  "Petrol / Diesel",
];

const expertRows = [
  {
    description: "Engine",
    cells: [
      "Up to DI Turbo, M2DI, MDI TC Variants (SZ/CRDe Engine Not Allowed.)",
      "Up to 1.3L Stock Engines (Turbo Upgrade Not Allowed)",
      "Diesel Engines Up to 3L. Turbo & Other Performance Upgrades Allowed.",
      "Petrol Engines Up to 2.0L. Turbo & Other Performance Upgrades Allowed.",
      "Up To 4L Allowed",
    ],
  },
  {
    description: "Performance Upgrades",
    cells: [
      "Allowed (Performance upgrades like Tuning, Chips, Pump Tuning, Gear/Axle Ratio Upgrades, ECM Remapping, etc.)",
      "Allowed (Performance upgrades like Tuning, Chips, Pump Tuning, Gear/Axle Ratio Upgrades, ECM Remapping, etc.)",
      "Allowed (Performance upgrades like Tuning, Chips, Pump Tuning, Gear/Axle Ratio Upgrades, ECM Remapping, etc.)",
      "Allowed (Performance upgrades like Tuning, Chips, Pump Tuning, Gear/Axle Ratio Upgrades, ECM Remapping, etc.)",
      "Allowed (Performance upgrades like Tuning, Chips, Pump Tuning, Gear/Axle Ratio Upgrades, ECM Remapping, etc.)",
    ],
  },
  {
    description: "Modified Exhausts & Headers",
    cells: ["Allowed", "Allowed", "Allowed", "Allowed", "Allowed"],
  },
  {
    description: "Offroad Protection Upgrades",
    cells: [
      "Allowed (Tank Guards, Transfer Case Guards, Differential Guards, Rock Sliders, Underbody Protection, etc.)",
      "Allowed (Tank Guards, Transfer Case Guards, Differential Guards, Rock Sliders, Underbody Protection, etc.)",
      "Allowed (Tank Guards, Transfer Case Guards, Differential Guards, Rock Sliders, Underbody Protection, etc.)",
      "Allowed (Tank Guards, Transfer Case Guards, Differential Guards, Rock Sliders, Underbody Protection, etc.)",
      "Allowed (Tank Guards, Transfer Case Guards, Differential Guards, Rock Sliders, Underbody Protection, etc.)",
    ],
  },
  {
    description: "Tyre Size",
    cells: [
      "Maximum 32\" when measured on a properly inflated tyre",
      "Maximum 32\" when measured on a properly inflated tyre",
      "Maximum 34\" when measured on a properly inflated tyre",
      "Maximum 34\" when measured on a properly inflated tyre",
      "38\"",
    ],
  },
  {
    description: "Fender Modifications for oversize tyres",
    cells: [
      "Only Nominal Fender Modifications Allowed",
      "Only Nominal Fender Modifications Allowed",
      "Allowed",
      "Allowed",
      "Allowed",
    ],
  },
  {
    description: "Suspension Upgrades (Modified shock absorbers, Shackle lifts, Body Bush lifts)",
    cells: ["Allowed", "Allowed", "Allowed", "Allowed", "Allowed"],
  },
  {
    description: "Negative Offset Rims / Spacers",
    cells: ["Allowed", "Allowed", "Allowed", "Allowed", "Allowed"],
  },
  {
    description: "Overhang Cutting & Other Body Modifications",
    cells: [
      "Not Allowed (Gypsies with rear body shortened can compete by adding appropriate overhang fitment to the chassis matching OEM chassis length)",
      "Not Allowed (Gypsies with rear body shortened can compete by adding appropriate overhang fitment to the chassis matching OEM chassis length)",
      "Allowed",
      "Allowed",
      "Allowed",
    ],
  },
  {
    description: "Reverse Shackles",
    cells: ["Not Allowed", "Not Allowed", "Allowed", "Allowed", "Allowed"],
  },
  {
    description: "Wheelbase Reduction",
    cells: ["Not Allowed", "Not Allowed", "Allowed", "Allowed", "Allowed"],
  },
  {
    description: "Differentials & Differential Upgrades",
    cells: [
      "Open/Closed Knuckle Differentials for SWB 81\", LWB 91\" and above Jeeps - CJ500, Major, MM550, Thar DI",
      "OEM Gypsy Differentials / OEM Differentials",
      "Non-OEM Differential Swap Allowed (Portal Axels Not Allowed)",
      "Non-OEM Differential Swap Allowed (Portal Axels Not Allowed)",
      "Differential Swap Allowed / Portal Axles Allowed",
    ],
  },
  {
    description: "Air Intake Snorkel",
    cells: [
      "Not Mandatory but Recommended",
      "Not Mandatory but Recommended",
      "Air Intake Snorkel Mandatory",
      "Air Intake Snorkel Mandatory",
      "Air Intake Snorkel Mandatory",
    ],
  },
  {
    description: "SpOA",
    cells: ["Not Allowed", "Not Allowed", "Allowed", "Allowed", "Allowed"],
  },
  {
    description: "Coil Spring / joint / multi-Link Suspension",
    cells: ["Not Allowed", "Not Allowed", "Not Allowed", "Not Allowed", "Allowed"],
  },
  {
    description: "Lockers (Front & Rear)",
    cells: ["Not Allowed", "Not Allowed", "Allowed", "Allowed", "Allowed"],
  },
  {
    description: "Cutting Brakes",
    cells: ["Not Allowed", "Not Allowed", "Allowed", "Allowed", "Allowed"],
  },
  {
    description: "Power Steering Upgrade",
    cells: [
      "OEM/Equivalent Power Steering Upgrades Allowed",
      "OEM/Equivalent Power Steering Upgrades Allowed",
      "OEM/Equivalent Power Steering Upgrades Allowed",
      "OEM/Equivalent Power Steering Upgrades Allowed",
      "Allowed (Hydraulic / Orbital)",
    ],
  },
  {
    description: "Four Wheel Steering",
    cells: ["Not Allowed", "Not Allowed", "Not Allowed", "Not Allowed", "Allowed"],
  },
  {
    description: "Roll Cage",
    cells: [
      "Minimum Four Point Roll Cage Mandatory",
      "Minimum Four Point Roll Cage Mandatory",
      "Minimum Six Point Roll Cage Mandatory",
      "Minimum Six Point Roll Cage Mandatory",
      "Minimum Six Point Roll Cage Mandatory",
    ],
  },
  {
    description: "Roof Plate / Overhead Solid Plate",
    cells: [
      "2MM Metal or 3MM Aluminum Roof Plate Above Driver Cabin for all Soft Top Vehicles Mandatory",
      "2MM Metal or 3MM Aluminum Roof Plate Above Driver Cabin for all Soft Top Vehicles Mandatory",
      "2MM Metal or 3MM Aluminum Roof Plate Above Driver Cabin for all Soft Top Vehicles Mandatory",
      "2MM Metal or 3MM Aluminum Roof Plate Above Driver Cabin for all Soft Top Vehicles Mandatory",
      "2MM Metal or 3MM Aluminum Roof Plate Above Driver Cabin for all Soft Top Vehicles Mandatory",
    ],
  },
  {
    description: "Seat Belts / Safety Harness",
    cells: [
      "Minimum 3 Point Seatbelts with appropriate latching Mandatory",
      "Minimum 3 Point Seatbelts with appropriate latching Mandatory",
      "Minimum 4 Point Seatbelts with appropriate latching mechanism Mandatory",
      "Minimum 4 Point Seatbelts with appropriate latching mechanism Mandatory",
      "Minimum 4 Point Seatbelts with appropriate latching mechanism Mandatory",
    ],
  },
  {
    description: "Doors",
    cells: [
      "Appropriate Heavy Duty, Half/Full Sized, Doors with Proper Latching Mechanism. Single pipe doors not Allowed",
      "Appropriate Heavy Duty, Half/Full Sized, Doors with Proper Latching Mechanism. Single pipe doors not Allowed",
      "Appropriate Heavy Duty, Half/Full Sized, Doors with Proper Latching Mechanism. Single pipe doors not Allowed",
      "Appropriate Heavy Duty, Half/Full Sized, Doors with Proper Latching Mechanism. Single pipe doors not Allowed",
      "Appropriate Heavy Duty, Half/Full Sized, Doors with Proper Latching Mechanism. Single pipe doors not Allowed",
    ],
  },
];

const stockColumns = ["Description", "Diesel Stock", "Petrol Stock"];

const stockRows = [
  {
    description: "Engine",
    cells: [
      "OEM Engines, DI Turbo, MDI are allowed, Turbo Upgrade Not Allowed (sz/crde/m2ditc not allowed)",
      "Up to 1.3L Stock Engines, turbo Upgrade Not Allowed.",
    ],
  },
  { description: "Performance Upgrades", cells: ["Not Allowed", "Not Allowed"] },
  { description: "Modified Exhausts & Headers", cells: ["Allowed", "Allowed"] },
  {
    description: "Offroad Protection Upgrades",
    cells: [
      "Allowed (Tank Guards, Transfer Case Guards, Differential Guards, Rock Sliders, Underbody Protection, etc.)",
      "Allowed (Tank Guards, Transfer Case Guards, Differential Guards, Rock Sliders, Underbody Protection, etc.)",
    ],
  },
  {
    description: "Tyre Size",
    cells: ["Only NDMS 6.00.16 For Diesel Category", "Only 78. 15 For Petrol Category"],
  },
  { description: "Fender Modifications for oversize tyres", cells: ["Not Allowed", "Not Allowed"] },
  {
    description: "Suspension Upgrades (Modified shock absorbers, Shackle lifts, Body Bush lifts)",
    cells: ["Not Allowed", "Not Allowed"],
  },
  { description: "Negative Offset Rims / Spacers", cells: ["Not Allowed", "Not Allowed"] },
  { description: "Overhang Cutting & Other Body Modifications", cells: ["Not Allowed", "Not Allowed"] },
  { description: "Reverse Shackles", cells: ["Not Allowed", "Not Allowed"] },
  { description: "Wheelbase Reduction", cells: ["Not Allowed", "Not Allowed"] },
  {
    description: "Differentials & Differential Upgrades",
    cells: ["OEM Differentials", "OEM Gypsy Differentials / OEM Differentials"],
  },
  { description: "Air Intake Snorkel", cells: ["Not Mandatory", "Not Mandatory"] },
  { description: "SpOA", cells: ["Not Allowed", "Not Allowed"] },
  { description: "Coil Spring / joint / multi-Link Suspension", cells: ["Not Allowed", "Not Allowed"] },
  { description: "Lockers (Front & Rear)", cells: ["Not Allowed", "Not Allowed"] },
  { description: "Cutting Brakes", cells: ["Not Allowed", "Not Allowed"] },
  {
    description: "Power Steering Upgrade",
    cells: ["OEM/Equivalent Power Steering Upgrades Allowed", "OEM/Equivalent Power Steering Upgrades Allowed"],
  },
  { description: "Four Wheel Steering", cells: ["Not Allowed", "Not Allowed"] },
  { description: "Roll Cage", cells: ["Not Mandatory", "Minimum Four Point Roll Cage Recommended"] },
  { description: "Roof Plate / Overhead Solid Plate", cells: ["Not Mandatory", "Not Mandatory"] },
  {
    description: "Seat Belts / Safety Harness",
    cells: ["Minimum 3 Point Seatbelts with appropriate latching", "Recommended Not Mandatory"],
  },
  { description: "Doors", cells: ["Not Mandatory", "Not Mandatory"] },
];

const suvColumns = ["Description", "THAR", "JIMNY", "THAR AND JIMNY"];

const suvRows = [
  { description: "Engine", cells: ["OEM", "OEM", "OEM"] },
  {
    description: "Performance Upgrades",
    cells: [
      "ECU/ECM Remapping, Engine Tuning Allowed FOR ALL CATEGORIES",
      "ECU/ECM Remapping, Engine Tuning Allowed FOR ALL CATEGORIES",
      "ECU/ECM Remapping, Engine Tuning Allowed FOR ALL CATEGORIES",
    ],
  },
  { description: "Modified Exhausts & Headers", cells: ["Allowed", "Allowed", "Allowed"] },
  {
    description: "Offroad Protection Upgrades",
    cells: [
      "Allowed AND RECOMENDED (Tank Guards, Transfer Case Guards, Differential Guards, Rock Sliders, Underbody Protection, etc.)",
      "Allowed AND RECOMENDED (Tank Guards, Transfer Case Guards, Differential Guards, Rock Sliders, Underbody Protection, etc.)",
      "Allowed AND RECOMENDED (Tank Guards, Transfer Case Guards, Differential Guards, Rock Sliders, Underbody Protection, etc.)",
    ],
  },
  { description: "Tyre Size", cells: ["OEM size - AT Tyres are allowed", "OEM size - AT Tyres are allowed", "35\" MT Tyres allowed"] },
  { description: "Fender Modification / BUMPER STEPS REMOVAL", cells: ["Allowed", "Allowed", "Allowed"] },
  {
    description: "Suspension Upgrades",
    cells: [
      "SUSPENSION SETUP SHOULD BE OEM OR EQUIVALENT, NO LIFT KITS ALLOWED",
      "SUSPENSION SETUP SHOULD BE OEM OR EQUIVALENT, NO LIFT KITS ALLOWED",
      "Allowed",
    ],
  },
  { description: "Negative Offset Rims / Spacers", cells: ["Allowed", "Allowed", "Allowed"] },
  { description: "Overhang Cutting & Other Body Modifications", cells: ["Not Allowed", "Not Allowed", "Not Allowed"] },
  { description: "Reverse Shackles", cells: ["Not Allowed", "Not Allowed", "Not Allowed"] },
  { description: "Wheelbase Reduction", cells: ["Not Allowed", "Not Allowed", "Not Allowed"] },
  {
    description: "Differentials & Differential Upgrades",
    cells: ["OEM Differentials", "OEM Differentials", "OEM diffrentials"],
  },
  { description: "Air Intake Snorkel", cells: ["Not Mandatory", "Not Mandatory", "Not mandatory"] },
  { description: "SpOA", cells: ["Not Allowed", "Not Allowed", "Not allowed"] },
  { description: "Coil Spring / joint / multi-Link Suspension", cells: ["Not Allowed", "Not Allowed", "Allowed / Non OEM also Allowed"] },
  { description: "Lockers (Front & Rear)", cells: ["Only OEM", "Only OEM", "Allowed / Non OEM also Allowed"] },
  { description: "Cutting Brakes", cells: ["Not Allowed", "Not Allowed", "Not allowed"] },
  { description: "Power Steering Upgrade", cells: ["OEM ONLY", "OEM ONLY", "OEM only"] },
  { description: "Four Wheel Steering", cells: ["Not ALLOWED", "Not ALLOWED", "not allowed"] },
  { description: "Roll Cage", cells: ["Not Mandatory, Minimum Four Point Roll Cage Recommended", "Not Mandatory, Minimum Four Point Roll Cage Recommended", "Recommended"] },
  {
    description: "Roof Plate / Overhead Solid Plate",
    cells: [
      "2MM Metal / 3MM Aluminum Mandatory (for soft tops) Not Mandatory for Hardtop Vehicles",
      "2MM Metal / 3MM Aluminum Mandatory (for soft tops) Not Mandatory for Hardtop Vehicles",
      "2MM Metal / 3MM Aluminum Mandatory (for soft tops) Not Mandatory for Hardtop Vehicles",
    ],
  },
  {
    description: "Seat Belts / Safety Harness",
    cells: [
      "Minimum 3 Point Seatbelts with appropriate latching Mandatory",
      "Minimum 3 Point Seatbelts with appropriate latching Mandatory",
      "Minimum 3 Point Seatbelts with appropriate latching Mandatory",
    ],
  },
  { description: "Doors", cells: ["OEM DOORS MANDATORY (DOOR REMOVAL NOT LLOWED)", "OEM DOORS MANDATORY (DOOR REMOVAL NOT LLOWED)", "OEM DOORS MANDATORY (DOOR REMOVAL NOT LLOWED)"] },
];

const mandatoryRows = [
  ["Helmets", "ISI / FIA / FIM Standard Crash Helmets for both driver and co-driver"],
  ["Name Stickers", "Name and Blood Group Stickers on both drivers and co-drivers' helmet and on vehicle - below windshield OR on fenders"],
  ["First Aid Kit", "Comprehensive First Aid Kit"],
  ["Spare Wheel", "Appropriately sized spare wheel"],
  ["Recovery Points", "OEM recovery points / Bright colored front & rear recovery points"],
  ["Lights & Electricals", "Working lights, indicators, wipers, and horn"],
  ["Recovery Strap", "Minimum 5-Metre-Long Recovery Strap (Recommend Minimum 4000 Kg Rated)"],
  ["Shackles", "2 x D Shackles (Recommended Rated at 3250 Kg or more)"],
  ["Gloves", "Appropriate Driving Gloves"],
];

const recommendedRows = [
  ["Fire Extinguishers", "One valid 1.8kg or two 0.9kg operable ABC type fire extinguishers mounted within easy reach of the driver and co-driver"],
  ["Glasses", "Eye protection glasses"],
  ["Toolkit", "Appropriate comprehensive tool kit and vital spares"],
  ["Wireless Comms", "Wireless intercoms only for communication between Driver and Co-Driver"],
  ["Aux Lights", "Auxiliary lights / LED bars (Otherwise covered when not on track)"],
  ["Puncture repair kit", "Puncture repair kit with Air Compressor"],
  ["Clothing", "Fully covered clothing"],
  ["Rain / Sun Gear", "Appropriate rain / Sun gear + Umbrellas"],
  ["Shoes", "Appropriate shoes for the terrain"],
  ["Battery Isolation Switch", "Mechanical Battery Isolation Switch"],
  ["Garbage Bags", "Garbage Bags (Min. 3 Pcs)"],
];

const organizerNote =
  "The organizers may merge split a category based on the number of entries received in a particular class to ensure a fair, competitive and rational grouping. Participants will be notified in advance of such changes before the event.";

function SpecTable({ title, subtitle, columns, rows, groups }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/30">
      <div className="border-b border-white/10 bg-[#ff8a00] px-5 py-4 text-black sm:px-8">
        <p className="font-heading text-xl uppercase italic tracking-tight sm:text-2xl">{title}</p>
        {subtitle && <p className="mt-1 text-xs font-black uppercase tracking-[0.22em] opacity-75">{subtitle}</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            {groups && (
              <tr className="bg-zinc-900 text-white">
                {groups.map((group) => (
                  <th
                    key={group.label}
                    colSpan={group.span}
                    className="border-r border-white/10 px-4 py-3 text-center font-heading text-xs uppercase tracking-[0.2em] last:border-r-0"
                  >
                    {group.label}
                  </th>
                ))}
              </tr>
            )}
            <tr className="bg-black text-[#ff8a00]">
              {columns.map((column) => (
                <th
                  key={column}
                  className="border-r border-white/10 px-4 py-4 align-top font-heading text-xs uppercase tracking-[0.18em] last:border-r-0"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.description} className="border-t border-white/10 transition-colors hover:bg-white/[0.03]">
                <th className="w-56 border-r border-white/10 bg-zinc-900/70 px-4 py-4 align-top font-heading text-xs uppercase tracking-[0.12em] text-white">
                  {row.description}
                </th>
                {row.cells.map((cell, index) => (
                  <td key={`${row.description}-${index}`} className="border-r border-white/10 px-4 py-4 align-top text-xs leading-relaxed text-zinc-300 last:border-r-0">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-white/10 bg-black/50 px-5 py-4 text-xs leading-relaxed text-zinc-500 sm:px-8">{organizerNote}</p>
    </section>
  );
}

function AccessoryTable({ title, rows }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/30">
      <div className="border-b border-white/10 bg-[#ff8a00] px-5 py-4 text-black sm:px-8">
        <p className="font-heading text-xl uppercase italic tracking-tight sm:text-2xl">{title}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="bg-black text-[#ff8a00]">
              <th className="w-64 border-r border-white/10 px-4 py-4 font-heading text-xs uppercase tracking-[0.18em]">Description</th>
              <th className="px-4 py-4 font-heading text-xs uppercase tracking-[0.18em]">Specification</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([item, spec]) => (
              <tr key={item} className="border-t border-white/10 transition-colors hover:bg-white/[0.03]">
                <th className="border-r border-white/10 bg-zinc-900/70 px-4 py-4 align-top font-heading text-xs uppercase tracking-[0.12em] text-white">
                  {item}
                </th>
                <td className="px-4 py-4 align-top text-xs leading-relaxed text-zinc-300">{spec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RuleBookPanel() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/30">
        <div className="border-b border-white/10 bg-[#ff8a00] px-5 py-6 text-black sm:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] opacity-75">Official Rule Book</p>
          <h2 className="mt-3 font-heading text-4xl uppercase italic leading-[0.9] tracking-tight sm:text-6xl md:text-7xl">
            Team Karad Offroaders Season 2 - 2026
          </h2>
          <p className="mt-3 text-xs font-black uppercase tracking-[0.22em] opacity-80">
            Penalty and Details Competition Rules
          </p>
        </div>
        <div className="space-y-4 bg-black/55 p-5 sm:p-8">
          {ruleBookIntro.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-7 text-zinc-300 sm:text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/30">
        <div className="border-b border-white/10 bg-zinc-900 px-5 py-4 sm:px-8">
          <p className="font-heading text-2xl uppercase italic tracking-tight text-[#ff8a00] sm:text-3xl">
            Penalty Summary
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="bg-black text-[#ff8a00]">
                {["Rule", "Penalty", "Details"].map((heading) => (
                  <th
                    key={heading}
                    className="border-r border-white/10 px-4 py-4 font-heading text-xs uppercase tracking-[0.18em] last:border-r-0"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {penaltySummaryRows.map(([rule, penalty, details]) => (
                <tr key={rule} className="border-t border-white/10 transition-colors hover:bg-white/[0.03]">
                  <th className="w-56 border-r border-white/10 bg-zinc-900/70 px-4 py-4 align-top font-heading text-xs uppercase tracking-[0.12em] text-white">
                    {rule}
                  </th>
                  <td className="w-40 border-r border-white/10 px-4 py-4 align-top text-sm font-black uppercase text-[#ff8a00]">
                    {penalty}
                  </td>
                  <td className="px-4 py-4 align-top text-sm leading-relaxed text-zinc-300">{details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <RuleSection section={ruleBookSections[0]} />
      <RuleSection section={ruleBookSections[1]} />
      <RuleSection section={ruleBookSections[2]} />
      <RuleSection section={ruleBookSections[3]} />

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/30">
        <div className="border-b border-white/10 bg-[#ff8a00] px-5 py-4 text-black sm:px-8">
          <p className="font-heading text-2xl uppercase italic tracking-tight sm:text-3xl">Pointing System</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="bg-black text-[#ff8a00]">
                {Array.from({ length: 5 }).flatMap((_, index) => [
                  <th key={`position-${index}`} className="border-r border-white/10 px-4 py-4 font-heading text-xs uppercase tracking-[0.18em]">
                    Position
                  </th>,
                  <th key={`points-${index}`} className="border-r border-white/10 px-4 py-4 font-heading text-xs uppercase tracking-[0.18em] last:border-r-0">
                    Points
                  </th>,
                ])}
              </tr>
            </thead>
            <tbody>
              {pointingSystemRows.map((row) => (
                <tr key={row.map(([position]) => position).join("-")} className="border-t border-white/10 transition-colors hover:bg-white/[0.03]">
                  {row.flatMap(([position, points]) => [
                    <td key={`${position}-position`} className="border-r border-white/10 bg-zinc-900/70 px-4 py-3 font-mono text-sm font-black text-white">
                      {position}
                    </td>,
                    <td key={`${position}-points`} className="border-r border-white/10 px-4 py-3 font-mono text-sm font-black text-[#ff8a00] last:border-r-0">
                      {points}
                    </td>,
                  ])}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/10 bg-black/55 p-5 sm:p-8">
          <RuleList items={ruleBookSections[4].items} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {ruleBookSections.slice(5).map((section) => (
          <RuleSection key={section.title} section={section} compact />
        ))}
      </div>
      <section className="rounded-[2rem] border border-[#ff8a00]/30 bg-[#ff8a00]/10 p-5 text-center sm:p-8">
        <p className="font-heading text-2xl uppercase italic text-white sm:text-3xl">Thank you</p>
        <p className="mt-2 text-xs font-black uppercase tracking-[0.26em] text-[#ff8a00]">
          Team Karad Off-Roaders
        </p>
      </section>
    </div>
  );
}

function RuleSection({ section, compact = false }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/30">
      <div className="border-b border-white/10 bg-zinc-900 px-5 py-4 sm:px-8">
        <p className={`font-heading uppercase italic tracking-tight text-[#ff8a00] ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
          {section.title}
        </p>
      </div>
      <div className="bg-black/55 p-5 sm:p-8">
        <RuleList items={section.items} />
      </div>
    </section>
  );
}

function RuleList({ items }) {
  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li key={item} className="flex gap-3 text-sm leading-7 text-zinc-300 sm:text-base">
          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff8a00] font-mono text-[11px] font-black text-black">
            {index + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export default function RegulationsPage() {
  const [activeTab, setActiveTab] = useState("vehicle-specifications");
  const isRuleBookTab = activeTab === "rule-book";

  return (
    <main className="min-h-screen bg-black px-4 pb-20 pt-24 text-white sm:px-6 md:pt-32">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(255,138,0,0.18),transparent_62%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 max-w-4xl">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.5em] text-[#ff8a00]">Regulations</p>
          <h1 className="font-heading text-5xl uppercase leading-none tracking-tight sm:text-7xl md:text-8xl">
            {isRuleBookTab ? (
              <span className="text-[#ff8a00] italic">Rulebook</span>
            ) : (
              <>
                Vehicle <span className="text-[#ff8a00] italic">Specifications</span>
              </>
            )}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            {isRuleBookTab
              ? "Team Karad Offroaders Season 2 - 2026 penalty and details competition rules."
              : "Team Karad Offroaders Season 2 - 2026 specification tables reproduced from the official PDF."}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="overflow-x-auto pb-3">
            <TabsList className="h-auto min-w-max gap-2 rounded-[1.5rem] border border-[#ff8a00]/30 bg-zinc-950/95 p-2 shadow-[0_0_35px_rgba(255,138,0,0.12)]">
              <TabsTrigger
                value="vehicle-specifications"
                className="gap-3 rounded-2xl border border-transparent px-5 py-4 font-heading text-[11px] uppercase tracking-[0.2em] text-zinc-300 transition-all hover:border-[#ff8a00]/30 hover:text-white data-[state=active]:border-[#ffb25a] data-[state=active]:bg-[#ff8a00] data-[state=active]:text-black data-[state=active]:shadow-[0_0_28px_rgba(255,138,0,0.35)] sm:px-7 sm:text-sm"
              >
                <ClipboardList className="h-5 w-5" />
                Vehicle Specifications
              </TabsTrigger>
              <TabsTrigger
                value="rule-book"
                className="gap-3 rounded-2xl border border-transparent px-5 py-4 font-heading text-[11px] uppercase tracking-[0.2em] text-zinc-300 transition-all hover:border-[#ff8a00]/30 hover:text-white data-[state=active]:border-[#ffb25a] data-[state=active]:bg-[#ff8a00] data-[state=active]:text-black data-[state=active]:shadow-[0_0_28px_rgba(255,138,0,0.35)] sm:px-7 sm:text-sm"
              >
                <BookOpen className="h-5 w-5" />
                Rule Book
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="vehicle-specifications" className="space-y-10">
            <SpecTable
              title="TEAM KARAD OFFROADERS SEASON 2 - 2026 EXPERT, MODIFIED, OPEN CLASS CATEGORIZATION"
              columns={expertColumns}
              groups={[
                { label: "Description", span: 1 },
                { label: "Expert Class", span: 2 },
                { label: "Modified Class", span: 2 },
                { label: "Open", span: 1 },
              ]}
              rows={expertRows}
            />

            <SpecTable
              title="TEAM KARAD OFFROADERS SEASON 2 - 2026 STOCK NDMS CLASS CATEGORIZATION"
              columns={stockColumns}
              groups={[
                { label: "Description", span: 1 },
                { label: "Stock NDMS", span: 2 },
              ]}
              rows={stockRows}
            />

            <SpecTable
              title="TEAM KARAD OFFROADERS SEASON 2 - 2026 SUV CLASS CATEGORIZATION"
              columns={suvColumns}
              groups={[
                { label: "Description", span: 1 },
                { label: "SUV Stock", span: 2 },
                { label: "SUV Modified", span: 1 },
              ]}
              rows={suvRows}
            />

            <div className="space-y-10">
              <div className="rounded-[2rem] border border-white/10 bg-zinc-950/70 p-5 sm:p-8">
                <p className="text-center font-heading text-2xl uppercase italic text-[#ff8a00] sm:text-3xl">
                  TEAM KARAD OFFROADERS SEASON 2 - 29/30/31st MAY 2026.
                </p>
                <p className="mt-3 text-center text-xs font-black uppercase tracking-[0.18em] text-zinc-400 sm:tracking-[0.28em]">
                  Mandatory & Recommended Modifications / Accessories / Specifications
                </p>
              </div>
              <AccessoryTable title="Mandatory for all classes" rows={mandatoryRows} />
              <AccessoryTable title="Recommended for all classes" rows={recommendedRows} />
            </div>
          </TabsContent>

          <TabsContent value="rule-book" className="space-y-10">
            <RuleBookPanel />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
