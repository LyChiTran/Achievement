"use client";

import { Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <header className="border-b glass">
                <div className="container mx-auto px-4 py-6">
                    <Link href="/" className="text-purple-600 hover:text-purple-700 font-bold text-xl">
                        ← Back
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="w-10 h-10 text-purple-600" />
                    <h1 className="text-4xl font-bold">Privacy Policy</h1>
                </div>

                <div className="glass rounded-xl p-8 space-y-6 text-gray-700">
                    <p className="text-sm text-gray-500">
                        Last updated: {new Date().toLocaleDateString('en-US')}
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">1. Information We Collect</h2>
                        <p className="mb-2">When you use Achievement Web, we may collect:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Personal information:</strong> Email, full name (optional)</li>
                            <li><strong>User data:</strong> Achievements, goals, skills, categories</li>
                            <li><strong>Technical information:</strong> IP address, browser type, device information</li>
                            <li><strong>Cookies:</strong> To maintain login sessions</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">2. How We Use Information</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide and improve our service</li>
                            <li>Verify accounts and ensure security</li>
                            <li>Send important service notifications</li>
                            <li>Analyze and improve user experience</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">3. Data Security</h2>
                        <p>We are committed to protecting your information:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Passwords encrypted with bcrypt</li>
                            <li>HTTPS for all connections</li>
                            <li>Data stored on secure servers</li>
                            <li>Regular security updates</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">4. Information Sharing</h2>
                        <p>We <strong>DO NOT</strong> sell or share your personal information with third parties, except:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>When required by law</li>
                            <li>To protect our rights and those of other users</li>
                            <li>With your explicit consent</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">5. User Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Access and view your personal data</li>
                            <li>Edit or delete your information</li>
                            <li>Export your data</li>
                            <li>Delete your account completely</li>
                            <li>Decline cookies (may affect functionality)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">6. Cookies</h2>
                        <p>We use cookies to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Maintain your login session</li>
                            <li>Remember your preferences</li>
                            <li>Analyze traffic</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">7. Policy Changes</h2>
                        <p>We may update this policy. Significant changes will be notified via email.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3">8. Contact</h2>
                        <p>If you have questions about this policy, please contact:</p>
                        <p className="mt-2">
                            <strong>Email:</strong> privacy@achievementweb.com<br />
                            <strong>Address:</strong> Ly Chi Tran
                        </p>
                    </section>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/register" className="text-purple-600 hover:underline font-semibold">
                        Back to Registration →
                    </Link>
                </div>
            </div>
        </div>
    );
}
