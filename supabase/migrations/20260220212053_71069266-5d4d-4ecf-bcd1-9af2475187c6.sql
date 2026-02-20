
-- Checklist items table
CREATE TABLE public.checklist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Analysis history table
CREATE TABLE public.analysis_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('correct', 'incorrect', 'partial')),
  title TEXT,
  topic TEXT,
  conclusion TEXT,
  reasons JSONB DEFAULT '[]',
  corrections JSONB DEFAULT '[]',
  tips JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for checklist_items
CREATE POLICY "Users can view own checklist items" ON public.checklist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own checklist items" ON public.checklist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own checklist items" ON public.checklist_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own checklist items" ON public.checklist_items FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for analysis_history
CREATE POLICY "Users can view own analysis history" ON public.analysis_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analysis history" ON public.analysis_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own analysis history" ON public.analysis_history FOR DELETE USING (auth.uid() = user_id);
