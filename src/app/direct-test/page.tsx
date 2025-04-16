"use client";

import React from 'react';
import Image from 'next/image';
import { projects } from '@/data/projects';

export default function DirectTestPage() {
  return (
    <div className="bg-black min-h-screen p-8">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Direct Image Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="relatixve aspect-video">
              {/* Using Next.js Image component */}
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h2 className="text-white text-xl font-bold">{project.title}</h2>
              <p className="text-gray-300 mt-2">{project.description}</p>
              <p className="text-gray-400 mt-2">Image path: {project.image}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
