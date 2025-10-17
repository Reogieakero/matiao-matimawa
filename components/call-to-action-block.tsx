// components/call-to-action-block.tsx
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { motion } from "framer-motion"

export const CallToActionBlock = () => (
    <motion.section 
        className="mt-20 py-12 px-8 rounded-2xl bg-primary/10 border-2 border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
    >
        <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                Can't Find What You Need?
            </h3>
            <p className="text-muted-foreground text-lg">
                Reach out directly to the Barangay Hall or subscribe for real-time updates.
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Button size="lg" asChild className="font-semibold shadow-md">
                <a href="/contact">
                    <Users className="h-5 w-5 mr-2" />
                    Contact Officials
                </a>
            </Button>
        </div>
    </motion.section>
);