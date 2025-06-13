# StackSmith-UI

StackSmith-UI is a React/Next.js frontend application designed to interact with a backend API that generates reproducible HPC software environment specifications using Spack. It allows users to select software packages, specify versions, variants, and compilers, and generates a Spack YAML configuration for easy environment building.

---

## Features

- Dynamic form to add and configure multiple software packages
- Supports specifying package versions, variants, and compilers
- Connects to a backend API to generate valid Spack environment YAML files
- Responsive and user-friendly UI (built with React and Next.js)
- Easily extensible for additional package metadata and features

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm (v8+ recommended)
- Access to the StackSmith backend API (running locally or remotely)

### Installation

1. Clone the repository

```bash
git clone https://github.com/Jperez3313/StackSmith-ui.git
cd StackSmith-ui

