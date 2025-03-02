import { motion } from "framer-motion";
import { Check, Trash, Share2, Download } from "lucide-react";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  steps: Array<{ id: string; text: string; completed: boolean }>;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onExport: (id: string) => void;
}

export const TaskCard = ({ 
  id, 
  title, 
  description, 
  steps, 
  completed,
  onToggle,
  onDelete,
  onShare,
  onExport 
}: TaskCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 
                backdrop-blur-xl p-6 rounded-2xl
                border border-white/20 hover:border-teal-500/50
                shadow-lg hover:shadow-xl hover:shadow-teal-500/10
                transition-all duration-500 ease-out"
    >
      {/* Effet de glassmorphism en arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(id)}
              className={`flex-shrink-0 w-6 h-6 mt-1 flex items-center justify-center rounded-full 
                       transition-all duration-300 ease-out
                       ${completed 
                         ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-teal-500/30" 
                         : "border-2 border-white/30 hover:border-teal-400"}`}
            >
              {completed && <Check className="w-4 h-4 text-white" />}
            </motion.button>

            <div>
              <h3 className={`text-lg font-medium tracking-tight
                           ${completed 
                             ? "text-white/50 line-through decoration-2" 
                             : "text-white/90 group-hover:text-white transition-colors"}`}>
                {title}
              </h3>
              <p className="text-sm text-white/60 mt-1 group-hover:text-white/70 transition-colors">
                {description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onShare(id)}
              className="p-2 text-white/50 hover:text-cyan-400 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onExport(id)}
              className="p-2 text-white/50 hover:text-emerald-400 transition-colors"
            >
              <Download className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(id)}
              className="p-2 text-white/50 hover:text-red-400 transition-colors"
            >
              <Trash className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Liste des étapes */}
        <div className="space-y-2 mt-2">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${step.completed ? 'bg-emerald-400' : 'bg-white/30'}`} />
              <span className={`text-sm ${step.completed ? 'text-white/50 line-through' : 'text-white/70'}`}>
                {step.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}; 