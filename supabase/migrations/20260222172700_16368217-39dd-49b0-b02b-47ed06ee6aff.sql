
-- Create custom_checklists table
CREATE TABLE public.custom_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_checklists ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own checklists" ON public.custom_checklists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checklists" ON public.custom_checklists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own checklists" ON public.custom_checklists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own checklists" ON public.custom_checklists FOR DELETE USING (auth.uid() = user_id);

-- Add checklist_id to checklist_items (nullable - null means default checklist)
ALTER TABLE public.checklist_items ADD COLUMN checklist_id UUID REFERENCES public.custom_checklists(id) ON DELETE CASCADE;
