# PlayForCause ⛳💛

PlayForCause is a functional Subscription-based web platform connecting golf performance with social impact. 
Users subscribe to the platform, log their scores, see a portion of their subscription yields directed to standard progressive charities, and active participants get automatically entered into monthly reward draws!

Built with **Next.js**, **Node.js**, **Express**, and **Prisma** accompanied by a gorgeous UI built leveraging tailored "Playful Neobrutalism" aesthetics!

## 🚀 Key Features

* **Subscription Access Guards**: Users must hold active Monthly or Yearly memberships to log new scores and interact with platform draws. Automatically redirects non-subscribers gracefully.
* **Score Tracking**: Track the 5 most recent performance entries automatically dropping dead weight scores.
* **Charity Selection**: Platform integration tying a custom percentage of active subscription yields seamlessly to user-chosen charities.
* **Admin Verification & Winnings**: Easily run automated monthly reward draws algorithmically matching winning participants based on performance logging.

## 🔐 Invigilator / Admin Testing Credentials

To fully review the system, navigate to the `Dashboard` -> `Admin Hub` and trigger the monthly score distributions. Invigilators can use the following default staging credentials:
- **Email**: `admin@playforcause.com`
- **Password**: `admin123`

## 🛠 Tech Stack 

- **Frontend Environment**: Next.js, Tailwind CSS (Vanilla utilities), Lucide React
- **Backend Environment**: Node.js, Express, native routing
- **Database Architecture**: Prisma ORM, JWT Middleware
