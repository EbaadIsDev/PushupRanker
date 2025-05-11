import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PushupSubmission } from '@shared/schema';
import { DIFFICULTY_LEVELS } from '@/lib/rankSystem';
import soundManager from '@/lib/sounds';
import { useSettings } from '@/context/SettingsContext';

// Validation schema
const formSchema = z.object({
  count: z.number({
    required_error: "Count is required",
    invalid_type_error: "Count must be a number",
  }).min(1, "Must be at least 1 pushup"),
  difficultyLevel: z.string().default("standard"),
});

interface PushupFormProps {
  onSubmit: (data: PushupSubmission) => Promise<boolean>;
}

const PushupForm = ({ onSubmit }: PushupFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { settings } = useSettings();
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      count: undefined,
      difficultyLevel: "standard",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Play button click sound if enabled
    if (settings.soundEnabled) {
      soundManager.play('buttonClick');
    }
    
    // Convert count to number if it's a string
    const count = typeof values.count === 'string' ? parseInt(values.count, 10) : values.count;
    
    try {
      const result = await onSubmit({
        count,
        difficultyLevel: values.difficultyLevel,
      });
      
      if (result) {
        // Reset form on successful submission
        form.reset({
          count: undefined,
          difficultyLevel: "standard",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-md mx-auto bg-gray-800 rounded-xl p-6 shadow-lg mb-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Record Your Pushups</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="count"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-400">
                  How many pushups did you do?
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Enter count"
                      min={1}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg py-6 px-4 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-70">
                      <i className="ri-fitness-line text-gray-400"></i>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="difficultyLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-400">
                  Difficulty Level
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg py-6 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 text-white border border-gray-700">
                    {DIFFICULTY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value} className="text-white hover:bg-gray-700">
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-6 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center justify-center"
          >
            <i className="ri-save-line mr-2"></i>
            <span>{isSubmitting ? 'Saving...' : 'Save Pushups'}</span>
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default PushupForm;
