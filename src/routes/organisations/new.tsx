import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ChevronsUpDown,
  ImageIcon,
  Plus,
  X,
} from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Badge } from "#client/components/ui/badge";
import { Button } from "#client/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#client/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "#client/components/ui/command";
import { Input } from "#client/components/ui/input";
import { Label } from "#client/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#client/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#client/components/ui/select";
import { Textarea } from "#client/components/ui/textarea";
import {
  CATEGORY_OPTIONS,
  COUNTRIES,
  DISTRICTS,
  FormInput,
  SKILL_CHOICES,
  TAG_CHOICES,
} from "#client/helper/index.ts";

// ---------- Constants ----------
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Searchable Combobox Component
function Combobox({
  options,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  className = "",
}: {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Reset search when dropdown closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={`relative ${className}`}>
          <Input
            ref={inputRef}
            value={open ? searchQuery : value}
            onChange={(e) => {
              if (open) {
                setSearchQuery(e.target.value);
              }
            }}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full pr-8"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 h-9 w-8 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            disabled={disabled}
          >
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)" }}
        onWheel={(e) => {
          // Prevent scroll propagation to page when scrolling inside dropdown
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          // Prevent scroll propagation on touch devices
          e.stopPropagation();
        }}
      >
        <Command shouldFilter={false}>
          <CommandList
            className="max-h-[300px] overflow-y-auto overscroll-contain"
            style={{
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              maxHeight: "300px",
            }}
            onWheel={(e) => {
              // Stop scroll event from propagating to parent
              e.stopPropagation();
              const target = e.currentTarget;
              const { scrollTop, scrollHeight, clientHeight } = target;
              const isAtTop = scrollTop === 0;
              const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

              // Prevent page scroll if we can scroll within the dropdown
              if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
                e.preventDefault();
              }
            }}
            onTouchMove={(e) => {
              // Prevent touch scroll propagation
              e.stopPropagation();
            }}
          >
            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onValueChange(option);
                    setSearchQuery("");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === option ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Skills Selector Component
function SkillsSelector({
  value,
  onChange,
}: {
  value: string[];
  onChange: (skills: string[]) => void;
}) {
  const selectedSkills = value || [];
  const availableSkills = SKILL_CHOICES.filter(
    (skill) => !selectedSkills.includes(skill),
  );
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSkills = availableSkills.filter((skill) =>
    skill.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isCustomSkill =
    searchQuery.trim() &&
    !availableSkills.includes(searchQuery.trim()) &&
    !selectedSkills.includes(searchQuery.trim());

  const handleAddSkill = (skill: string) => {
    // Trim only leading/trailing spaces, preserve internal spaces
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !selectedSkills.includes(trimmedSkill)) {
      onChange([...selectedSkills, trimmedSkill]);
      setSearchQuery("");
      setOpen(false);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    onChange(selectedSkills.filter((s: string) => s !== skill));
  };

  // Handle escape key and click outside
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchQuery("");
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="space-y-3">
      {/* Add Skill button or searchable dropdown */}
      {!open ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      ) : (
        <div ref={containerRef} className="relative w-full">
          <Command className="border-input bg-background rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search skills or type to add custom..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList
              className="bg-popover absolute top-full right-0 left-0 z-50 mt-1 max-h-[200px] overflow-y-auto rounded-md border shadow-md"
              onWheel={(e) => {
                // Stop scroll event from propagating to parent
                e.stopPropagation();
                const target = e.currentTarget;
                const { scrollTop, scrollHeight, clientHeight } = target;
                const isAtTop = scrollTop === 0;
                const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

                // Prevent page scroll if we can scroll within the dropdown
                if (
                  (e.deltaY < 0 && !isAtTop) ||
                  (e.deltaY > 0 && !isAtBottom)
                ) {
                  e.preventDefault();
                }
              }}
              onTouchMove={(e) => {
                // Prevent touch scroll propagation
                e.stopPropagation();
              }}
            >
              {filteredSkills.length > 0 && (
                <CommandGroup heading="Available Skills">
                  {filteredSkills.map((skill) => (
                    <CommandItem
                      key={skill}
                      onSelect={() => handleAddSkill(skill)}
                    >
                      {skill}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {isCustomSkill && (
                <CommandGroup heading="Custom Skill">
                  <CommandItem onSelect={() => handleAddSkill(searchQuery)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add &quot;{searchQuery}&quot;
                  </CommandItem>
                </CommandGroup>
              )}
              <CommandEmpty>
                <div className="text-muted-foreground py-6 text-center text-sm">
                  {searchQuery.trim()
                    ? "No matching skills found."
                    : "Start typing to search or add a custom skill."}
                </div>
              </CommandEmpty>
            </CommandList>
          </Command>
        </div>
      )}

      {/* Selected skills as badges */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((skill: string) => (
            <Badge
              key={skill}
              variant="default"
              className="flex h-8 items-center gap-2 px-3 text-sm"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:bg-primary/80 -mr-1 rounded-full p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// Tags Selector Component
function TagsSelector({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const selectedTags = value || [];
  const availableTags = TAG_CHOICES.filter(
    (tag) => !selectedTags.includes(tag),
  );
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const isCustomTag =
    searchQuery.trim() &&
    !availableTags.includes(searchQuery.trim()) &&
    !selectedTags.includes(searchQuery.trim());

  const handleAddTag = (tag: string) => {
    // Trim only leading/trailing spaces, preserve internal spaces
    const trimmedTag = tag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      onChange([...selectedTags, trimmedTag]);
      setSearchQuery("");
      setOpen(false);
    }
  };

  const handleRemoveTag = (tag: string) => {
    onChange(selectedTags.filter((s: string) => s !== tag));
  };

  // Handle escape key and click outside
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchQuery("");
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="space-y-3">
      {/* Add Tag button or searchable dropdown */}
      {!open ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Tag
        </Button>
      ) : (
        <div ref={containerRef} className="relative w-full">
          <Command className="border-input bg-background rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search tags or type to add custom..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList
              className="bg-popover absolute top-full right-0 left-0 z-50 mt-1 max-h-[200px] overflow-y-auto rounded-md border shadow-md"
              onWheel={(e) => {
                // Stop scroll event from propagating to parent
                e.stopPropagation();
                const target = e.currentTarget;
                const { scrollTop, scrollHeight, clientHeight } = target;
                const isAtTop = scrollTop === 0;
                const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

                // Prevent page scroll if we can scroll within the dropdown
                if (
                  (e.deltaY < 0 && !isAtTop) ||
                  (e.deltaY > 0 && !isAtBottom)
                ) {
                  e.preventDefault();
                }
              }}
              onTouchMove={(e) => {
                // Prevent touch scroll propagation
                e.stopPropagation();
              }}
            >
              {filteredTags.length > 0 && (
                <CommandGroup heading="Available Tags">
                  {filteredTags.map((tag) => (
                    <CommandItem key={tag} onSelect={() => handleAddTag(tag)}>
                      {tag}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {isCustomTag && (
                <CommandGroup heading="Custom Tag">
                  <CommandItem onSelect={() => handleAddTag(searchQuery)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add &quot;{searchQuery}&quot;
                  </CommandItem>
                </CommandGroup>
              )}
              <CommandEmpty>
                <div className="text-muted-foreground py-6 text-center text-sm">
                  {searchQuery.trim()
                    ? "No matching tags found."
                    : "Start typing to search or add a custom tag."}
                </div>
              </CommandEmpty>
            </CommandList>
          </Command>
        </div>
      )}

      {/* Selected tags as badges */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag: string) => (
            <Badge
              key={tag}
              variant="default"
              className="flex h-8 items-center gap-2 px-3 text-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-primary/80 -mr-1 rounded-full p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/organisations/new")({
  component: NewProjectPage,
});

function NewProjectPage() {
  const nav = useNavigate();

  // Load saved form data from localStorage
  const loadSavedFormData = () => {
    try {
      const saved = localStorage.getItem("newListingFormDraft");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        if (parsed.start_date) parsed.start_date = new Date(parsed.start_date);
        if (parsed.end_date) parsed.end_date = new Date(parsed.end_date);
        if (parsed.application_deadline)
          parsed.application_deadline = new Date(parsed.application_deadline);
        return parsed;
      }
    } catch (e) {
      console.error("Failed to load saved form data:", e);
    }
    return null;
  };

  const savedData = loadSavedFormData();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    setError,
    clearErrors,
    getValues,
    trigger,
    formState: { errors, touchedFields, dirtyFields, isSubmitted },
  } = useForm<FormInput>({
    defaultValues: savedData || {
      title: "",
      summary: "",
      category: CATEGORY_OPTIONS[0],
      project_type: "local",

      description: "",
      about_provide: "",
      about_do: "",
      requirements: "",
      skill_tags: [],

      district: "",
      country: localStorage.getItem("lastSelectedCountry") || "",
      google_maps: "",
      remote: false,

      repeat_interval: 1, // numeric sessions/week
      repeat_unit: "week", // locked to 'week'
      days_of_week: [],
      time_start: "",
      time_end: "",
      start_date: undefined,
      end_date: undefined,
      application_deadline: undefined,

      commitable_hours: 40,
      slots: 10,

      image_url: "",
      project_tags: [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
    shouldFocusError: true,
  });

  // ---------- watchers ----------
  const category = watch("category");
  const projectType = watch("project_type");
  const start = watch("start_date");
  const end = watch("end_date");
  const deadline = watch("application_deadline");
  const repeatInterval = watch("repeat_interval");
  const timeStart = watch("time_start");
  const timeEnd = watch("time_end");
  const isRemote = watch("remote");
  const days_of_week = watch("days_of_week"); // ✅ ADD THIS

  // ISO string for tomorrow to use as <input min>

  // ---------- helpers ----------
  const DAY_MS = 24 * 60 * 60 * 1000;
  const WEEK_MS = 7 * DAY_MS;

  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const todayStart = () => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  };

  const daysBetween = (a?: Date, b?: Date) => {
    if (!a || !b) return 0;
    return Math.floor(
      (startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS,
    );
  };

  const toMinutes = (hhmm: string) => {
    if (!hhmm) return 0;
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + (m || 0);
  };

  const perSessionHours = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return 0;
    const mins = toMinutes(endStr) - toMinutes(startStr);
    return mins / 60;
  };

  const diffWeeks = (s?: Date, e?: Date): number => {
    if (!(s instanceof Date) || !(e instanceof Date)) return 0;
    const ms = e.getTime() - s.getTime();
    if (!(ms > 0)) return 0;
    const weeks = Math.ceil(ms / WEEK_MS);
    return Number.isFinite(weeks) ? Math.max(1, weeks) : 0;
  };

  const tomorrowIso = useMemo(() => {
    const t = todayStart();
    t.setDate(t.getDate() + 1);
    return t.toISOString().split("T")[0];
  }, []);

  const diffDaysInclusive = (s?: Date, e?: Date): number => {
    if (!(s instanceof Date) || !(e instanceof Date)) return 0;
    const ms = startOfDay(e).getTime() - startOfDay(s).getTime();
    return Math.floor(ms / DAY_MS) + 1; // ✅ inclusive of both start & end
  };

  // ✅ Map JavaScript getDay() -> Monday-based names
  const weekdayName = (d: Date) => {
    const i = d.getDay(); // 0 = Sunday, 6 = Saturday
    return DAYS[i === 0 ? 6 : i - 1]; // Monday=0
  };

  // ✅ Count matching weekdays inside [start, end]
  const countMatchingDates = (s?: Date, e?: Date, selectedDays?: string[]) => {
    if (!(s instanceof Date) || !(e instanceof Date) || !selectedDays?.length)
      return 0;
    let count = 0;
    const cur = startOfDay(s);
    const endDay = startOfDay(e).getTime();
    const probe = new Date(cur);
    while (probe.getTime() <= endDay) {
      if (selectedDays.includes(weekdayName(probe))) count++;
      probe.setDate(probe.getDate() + 1);
    }
    return count;
  };

  // track whether user has manually adjusted commitable_hours (so we don't overwrite)
  const userHoursTouchedRef = useRef(false);
  useEffect(() => {
    if (touchedFields.commitable_hours || dirtyFields.commitable_hours) {
      userHoursTouchedRef.current = true;
    }
  }, [touchedFields.commitable_hours, dirtyFields.commitable_hours]);

  // Auto-calc commitable hours when schedule changes (unless user has adjusted manually)
  useEffect(() => {
    const weeks = diffWeeks(start, end);
    const per = perSessionHours(timeStart, timeEnd);
    // For one-time projects (repeatInterval === 0), calculate as single session hours
    // For repeating projects, calculate as weeks * repeat_interval * per session
    const duration = diffDaysInclusive(start, end);

    // find which days in the range match the selected ones
    const matchingDaysCount = (() => {
      if (!start || !end || !days_of_week?.length) return 0;
      let count = 0;
      const cur = new Date(start);
      while (cur <= end) {
        const dayName = cur.toLocaleDateString("en-SG", { weekday: "long" });
        if (days_of_week.includes(dayName)) count++;
        cur.setDate(cur.getDate() + 1);
      }
      return count;
    })();

    const expected = matchingDaysCount * per;

    if (!userHoursTouchedRef.current) {
      if (Number.isFinite(expected) && expected > 0) {
        setValue("commitable_hours", Math.round(expected));
      }
    }
  }, [start, end, timeStart, timeEnd, repeatInterval, setValue]);

  // Derived expected hours (for UI hint)
  const expectedHours = useMemo(() => {
    const per = perSessionHours(timeStart, timeEnd);
    const matches = countMatchingDates(start, end, days_of_week);
    const expected = matches * per;
    return Number.isFinite(expected) && expected > 0 ? Math.round(expected) : 0;
  }, [start, end, timeStart, timeEnd, days_of_week]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const subscription = watch((value) => {
      try {
        // Convert Date objects to ISO strings for storage
        const dataToSave: any = { ...value };
        if (dataToSave.start_date instanceof Date) {
          dataToSave.start_date = dataToSave.start_date.toISOString();
        }
        if (dataToSave.end_date instanceof Date) {
          dataToSave.end_date = dataToSave.end_date.toISOString();
        }
        if (dataToSave.application_deadline instanceof Date) {
          dataToSave.application_deadline =
            dataToSave.application_deadline.toISOString();
        }
        localStorage.setItem("newListingFormDraft", JSON.stringify(dataToSave));
      } catch (e) {
        console.error("Failed to save form data:", e);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // ---------- Reactive validations ----------
  // Dates: validate reactively whenever *any* related date changes
  useEffect(() => {
    const s = start;
    const e = end;
    const dl = deadline;

    // Reusable helpers
    const tomorrow = todayStart();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const beforeTomorrow = (d?: Date) =>
      d ? startOfDay(d).getTime() < tomorrow.getTime() : false;

    // A) Each date must be >= tomorrow (strictly after today)
    if (s) {
      if (beforeTomorrow(s))
        setError("start_date", {
          type: "validate",
          message: "Start date must be after today (≥ tomorrow)",
        });
      else clearErrors("start_date");
    }
    if (e && repeatInterval !== 0) {
      if (beforeTomorrow(e))
        setError("end_date", {
          type: "validate",
          message: "End date must be after today (≥ tomorrow)",
        });
      else clearErrors("end_date");
    } else if (repeatInterval === 0) {
      clearErrors("end_date");
    }
    if (dl) {
      if (beforeTomorrow(dl))
        setError("application_deadline", {
          type: "validate",
          message: "Application deadline must be after today (≥ tomorrow)",
        });
      else clearErrors("application_deadline");
    }

    // B) End date cannot be earlier than start date (symmetrical errors; runs when either changes)
    // ✅ End date cannot be earlier than start date
    if (s && e) {
      if (startOfDay(e).getTime() < startOfDay(s).getTime()) {
        setError("end_date", {
          type: "validate",
          message: "End date cannot be earlier than start date",
        });
      } else {
        clearErrors("end_date");
      }
    }

    // C) Application deadline must be at least 1 day before the start date
    if (dl && s) {
      const gapDays = daysBetween(dl, s); // start - deadline
      if (gapDays < 1) {
        setError("application_deadline", {
          type: "validate",
          message:
            "Application deadline must be at least 1 day before the start date",
        });
        setError("start_date", {
          type: "validate",
          message:
            "Start date must be at least 1 day after the application deadline",
        });
      } else {
        if (!beforeTomorrow(dl)) clearErrors("application_deadline");
        if (!(e && e.getTime() < s.getTime()) && !beforeTomorrow(s))
          clearErrors("start_date");
      }
    }

    const duration = diffDaysInclusive(s, e);
    // E) Days of week <= duration
    if (
      Array.isArray(watch("days_of_week")) &&
      watch("days_of_week").length > duration
    ) {
      setError("days_of_week", {
        type: "validate",
        message: "Number of days selected exceeds project duration.",
      });
    }
  }, [start, end, deadline, repeatInterval, setError, clearErrors]);

  // Rule 0: When one-time is selected, set end_date to start_date
  useEffect(() => {
    if (repeatInterval === 0 && start) {
      setValue("end_date", start, { shouldValidate: false });
    }
  }, [repeatInterval, start, setValue]);

  // Rule 2: End time must be >= start time and at least 1 hour ahead
  useEffect(() => {
    if (timeStart && timeEnd) {
      const diffMins = toMinutes(timeEnd) - toMinutes(timeStart);
      if (diffMins < 60) {
        setError("time_end", {
          type: "validate",
          message: "End time must be ≥ 1 hour after start time",
        });
      } else {
        clearErrors("time_end");
      }
    }
  }, [timeStart, timeEnd, setError, clearErrors]);

  // Rule 5: Hours must be within ±10 of expected (and expected must be computable)
  // ✅ Auto-calc commitable hours (duration-based)
  useEffect(() => {
    const per = perSessionHours(timeStart, timeEnd);
    const matches = countMatchingDates(start, end, days_of_week);
    const expected = matches * per;

    if (!userHoursTouchedRef.current) {
      if (Number.isFinite(expected) && expected > 0) {
        setValue("commitable_hours", Math.round(expected));
      }
    }
  }, [start, end, timeStart, timeEnd, days_of_week, setValue]);

  // Ensure days_of_week cannot exceed repeatInterval; (UI limits already)

  // ---------- fix country reset on type toggle ----------
  useEffect(() => {
    if (projectType === "local") {
      setValue("country", ""); // clear when switching back to local
    } else if (projectType === "overseas") {
      const current = getValues("country");
      if (!current) {
        const last = localStorage.getItem("lastSelectedCountry") || "";
        setValue("country", last);
      }
    }
  }, [projectType, setValue, getValues]);

  useEffect(() => {
    if (projectType === "overseas") {
      setValue("remote", false, { shouldValidate: true });
      setValue("district", "");
      setValue("google_maps", "");
    }
  }, [projectType, setValue]);

  // ---------- submit with validations (kept as guardrails; most checks are reactive now) ----------
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    data.repeat_unit = "week"; // lock unit
    // Store form data in localStorage and navigate to preview
    const dataToSave: any = { ...data };
    // Convert Date objects to strings for localStorage
    if (dataToSave.start_date instanceof Date) {
      dataToSave.start_date = dataToSave.start_date.toISOString();
    }
    if (dataToSave.end_date instanceof Date) {
      dataToSave.end_date = dataToSave.end_date.toISOString();
    }
    if (dataToSave.application_deadline instanceof Date) {
      dataToSave.application_deadline =
        dataToSave.application_deadline.toISOString();
    }
    localStorage.setItem("newListingFormData", JSON.stringify(dataToSave));
    nav({ to: "/organisations/preview-new" });
  };

  const onError = () => {
    // Wait for errors to be rendered in the DOM
    setTimeout(() => {
      // First, try to find any element with aria-invalid="true"
      const invalidElement = document.querySelector('[aria-invalid="true"]');
      if (invalidElement) {
        invalidElement.scrollIntoView({ behavior: "instant", block: "center" });
        return;
      }

      // If no aria-invalid found, try to find the first error message
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        // Try to find input by name or id
        const inputElement = document.querySelector(
          `[name="${firstErrorField}"], #${firstErrorField}`,
        );
        if (inputElement) {
          inputElement.scrollIntoView({ behavior: "instant", block: "center" });
          return;
        }

        // Try to find error message element near the field
        const errorMessage = document.querySelector(`.text-red-600`);
        if (errorMessage) {
          errorMessage.scrollIntoView({ behavior: "instant", block: "center" });
        }
      }
    }, 100);
  };

  // ---------- UI ----------
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="text-muted-foreground mb-8 flex items-center gap-2 text-sm">
        <button
          onClick={() => nav({ to: "/organisations/dashboard" })}
          className="text-muted-foreground hover:text-foreground inline-flex items-center transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <span>/</span>
        <span className="text-foreground">Create New Listing</span>
      </div>
      <form
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
      >
        {/* BASIC INFO */}
        <Card>
          <CardHeader>
            <div className="space-y-3">
              <h2 className="font-heading text-2xl">Create New Listing</h2>
              <CardTitle>Basic Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter project title"
                {...register("title", { required: "Title is required" })}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="text-sm text-red-600">
                  {errors.title.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Project Summary</Label>
              <Textarea
                id="summary"
                rows={5}
                placeholder="Provide a brief summary of the project"
                {...register("summary", { required: "Summary is required" })}
                aria-invalid={!!errors.summary}
              />
              {errors.summary && (
                <p className="text-sm text-red-600">
                  {errors.summary.message as string}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => setValue("category", v)}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent
                    className="max-h-[300px]"
                    style={{
                      maxHeight: "300px",
                      overscrollBehavior: "contain",
                    }}
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Project Type</Label>
                <Select
                  value={projectType}
                  onValueChange={(v) =>
                    setValue("project_type", v as "local" | "overseas")
                  }
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent
                    className="max-h-[300px]"
                    style={{
                      maxHeight: "300px",
                      overscrollBehavior: "contain",
                    }}
                  >
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="overseas">Overseas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ABOUT */}
        <Card>
          <CardHeader>
            <CardTitle>About This Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                rows={8}
                placeholder="Provide a detailed description of the project"
                {...register("description", {
                  required: "Description is required",
                })}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="about_do">What Students will Do</Label>
              <Textarea
                id="about_do"
                rows={6}
                placeholder="Describe what volunteers will be doing during this project"
                {...register("about_do", {
                  required: "Please describe what volunteers will do",
                })}
                aria-invalid={!!errors.about_do}
              />
              {errors.about_do && (
                <p className="text-sm text-red-600">
                  {errors.about_do.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Student Requirements</Label>
              <Textarea
                id="requirements"
                rows={6}
                placeholder="List any requirements or qualifications needed"
                {...register("requirements", {
                  required: "Please list requirements",
                })}
                aria-invalid={!!errors.requirements}
              />
              {errors.requirements && (
                <p className="text-sm text-red-600">
                  {errors.requirements.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="about_provide">
                What You will Equip Students with
              </Label>
              <Textarea
                id="about_provide"
                rows={6}
                placeholder="Describe what resources or support will be provided to volunteers"
                {...register("about_provide", {
                  required: "Please describe what will students acquire",
                })}
                aria-invalid={!!errors.about_provide}
              />
              {errors.about_provide && (
                <p className="text-sm text-red-600">
                  {errors.about_provide.message as string}
                </p>
              )}
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle>Skills Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Choose the top skills required for the project
            </p>
            <Controller
              control={control}
              name="skill_tags"
              rules={{
                validate: (v) =>
                  (v?.length || 0) > 0 || "Select at least one skill",
              }}
              render={({ field }) => (
                <SkillsSelector
                  value={field.value || []}
                  onChange={(skills) => field.onChange(skills)}
                />
              )}
            />
            {errors.skill_tags && (
              <p className="text-sm text-red-600">
                {String(errors.skill_tags.message)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* LOCATION */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            {projectType === "local" ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {/* DISTRICT SELECT */}
                <div className="space-y-2 sm:col-span-1">
                  <Label>District</Label>
                  <Controller
                    control={control}
                    name="district"
                    rules={{
                      required: !watch("remote")
                        ? "District is required unless remote"
                        : false,
                    }}
                    render={({ field }) => (
                      <Combobox
                        options={DISTRICTS}
                        value={isRemote ? "" : field.value || ""}
                        onValueChange={(v) => field.onChange(v)}
                        placeholder="Select a district..."
                        disabled={isRemote}
                      />
                    )}
                  />
                  {errors.district && !isRemote && (
                    <p className="text-sm text-red-600">
                      {errors.district.message as string}
                    </p>
                  )}
                </div>

                {/* GOOGLE MAPS + REMOTE TOGGLE */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="google_maps">Google Maps URL</Label>
                  <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto]">
                    <Input
                      id="google_maps"
                      type="url"
                      placeholder="https://maps.google.com/..."
                      className="h-9"
                      {...register("google_maps")}
                      disabled={isRemote}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        id="remote"
                        type="checkbox"
                        {...register("remote")}
                        disabled={(projectType as string) === "overseas"} // ✅ disable for overseas
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setValue("remote", checked);
                          if (checked) {
                            setValue("district", "Remote");
                            setValue("google_maps", "");
                          } else {
                            setValue("district", "");
                          }
                        }}
                      />
                      <Label htmlFor="remote" className="mb-0 cursor-pointer">
                        Remote?
                      </Label>
                    </div>
                  </div>
                  {errors.google_maps && (
                    <p className="text-sm text-red-600">
                      {errors.google_maps.message as string}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* COUNTRY SELECT FOR OVERSEAS */}
                <div className="space-y-2">
                  <Label>Country</Label>
                  <div className="flex items-center gap-4">
                    <Controller
                      control={control}
                      name="country"
                      rules={{
                        required: !watch("remote")
                          ? "Country is required"
                          : false,
                      }}
                      render={({ field }) => (
                        <Combobox
                          options={COUNTRIES}
                          value={field.value || ""}
                          onValueChange={(v) => {
                            field.onChange(v);
                            localStorage.setItem("lastSelectedCountry", v); // ✅ remember last chosen country
                          }}
                          placeholder="Select a country..."
                          className="w-1/2"
                        />
                      )}
                    />
                    {(projectType as string) !== "overseas" && (
                      <div className="flex items-center gap-2">
                        <input
                          id="remote_overseas"
                          type="checkbox"
                          {...register("remote")}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setValue("remote", checked);
                            if (checked) {
                              setValue("district", "Remote");
                              setValue("google_maps", "");
                            } else {
                              setValue("district", "");
                            }
                          }}
                        />
                        <Label
                          htmlFor="remote_overseas"
                          className="mb-0 cursor-pointer opacity-90"
                        >
                          Remote?
                        </Label>
                      </div>
                    )}
                  </div>
                  {errors.country && !isRemote && isSubmitted && (
                    <p className="text-sm text-red-600">
                      {errors.country.message as string}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ---------- LOGISTICS & SCHEDULE (merged) ---------- */}
        <Card>
          <CardHeader>
            <CardTitle>Listing Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Controller
                  control={control}
                  name="start_date"
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <Input
                      id="start_date"
                      type="date"
                      min={tomorrowIso} // ✅ can't pick before start
                      value={
                        field.value
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined,
                        )
                      }
                      aria-invalid={!!errors.start_date}
                      className="relative pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
                    />
                  )}
                />
                {errors.start_date && (
                  <p className="text-sm text-red-600">
                    {errors.start_date.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Controller
                  control={control}
                  name="end_date"
                  rules={{
                    required:
                      repeatInterval !== 0 ? "End date is required" : false,
                  }}
                  render={({ field }) => (
                    <Input
                      id="end_date"
                      type="date"
                      min={
                        start ? start.toISOString().split("T")[0] : tomorrowIso
                      }
                      value={
                        field.value
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined,
                        )
                      }
                      disabled={repeatInterval === 0}
                      aria-invalid={!!errors.end_date}
                      className="relative pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
                    />
                  )}
                />
                {errors.end_date && repeatInterval !== 0 && (
                  <p className="text-sm text-red-600">
                    {errors.end_date.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="application_deadline">
                  Application Deadline
                </Label>
                <Controller
                  control={control}
                  name="application_deadline"
                  rules={{ required: "Application deadline is required" }}
                  render={({ field }) => (
                    <Input
                      id="application_deadline"
                      type="date"
                      min={tomorrowIso}
                      value={
                        field.value
                          ? field.value.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined,
                        )
                      }
                      aria-invalid={!!errors.application_deadline}
                      className="relative pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
                    />
                  )}
                />
                {errors.application_deadline && (
                  <p className="text-sm text-red-600">
                    {errors.application_deadline.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Repeats: Every [interval] [unit => locked to week] */}
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Label className="w-32 font-medium">Repeats every</Label>
              <div className="flex flex-1 items-center gap-4">
                <Input
                  type="number"
                  min={1}
                  step={1}
                  className="w-20"
                  disabled={repeatInterval === 0}
                  {...register("repeat_interval", {
                    required:
                      repeatInterval !== 0
                        ? "Repeat interval is required"
                        : false,
                    valueAsNumber: true,
                  })}
                  aria-invalid={!!errors.repeat_interval}
                />
                {errors.repeat_interval && (
                  <p className="text-sm text-red-600">
                    {errors.repeat_interval.message as string}
                  </p>
                )}
                <span className="text-muted-foreground text-sm">/week(s)</span>
                <div className="flex items-center gap-2">
                  <input
                    id="one_time"
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setValue("repeat_interval", 0);
                        // Don't clear days_of_week - allow user to select one day
                        // Only clear if more than one day is selected
                        const currentDays = getValues("days_of_week") || [];
                        if (currentDays.length > 1) {
                          setValue("days_of_week", []);
                        }
                      } else {
                        setValue("repeat_interval", 1);
                        // Clear days_of_week when switching from one-time to recurring
                        // so user can select the correct number of days based on repeat_interval
                        setValue("days_of_week", []);
                        // If end_date equals start_date (from one-time mode), clear end_date
                        // so user can set a proper date range for recurring projects
                        const currentStart = getValues("start_date");
                        const currentEnd = getValues("end_date");
                        if (
                          currentStart &&
                          currentEnd &&
                          startOfDay(currentStart).getTime() ===
                            startOfDay(currentEnd).getTime()
                        ) {
                          setValue("end_date", undefined, {
                            shouldValidate: false,
                          });
                        }
                      }
                    }}
                    checked={repeatInterval === 0}
                  />
                  <Label htmlFor="one_time" className="mb-0 cursor-pointer">
                    One-time
                  </Label>
                </div>
              </div>
            </div>

            {/* Days of the week selection (limited by repeat_interval) */}
            {
              <div className="space-y-2">
                <Label>Day(s) of the Week</Label>
                <Controller
                  control={control}
                  name="days_of_week"
                  rules={{
                    validate: (v) => {
                      if (repeatInterval === 0) {
                        return (
                          (v?.length || 0) === 1 ||
                          "Select exactly one day for a one-time project"
                        );
                      }
                      return (v?.length || 0) === (repeatInterval || 0)
                        ? true
                        : `Select exactly ${repeatInterval || 0} day${(repeatInterval || 0) === 1 ? "" : "s"} per week`;
                    },
                  }}
                  render={({ field }) => {
                    // ✅ Determine valid days based on date range
                    const value = field.value || [];
                    const isOneTime = repeatInterval === 0;
                    const duration = diffDaysInclusive(start, end);
                    const validSet = new Set<string>();
                    // Only restrict by date range for recurring projects with valid date range
                    if (!isOneTime && start && end && duration > 0) {
                      const cur = new Date(start);
                      cur.setHours(0, 0, 0, 0);
                      const endDay = startOfDay(end);
                      while (cur.getTime() <= endDay.getTime()) {
                        validSet.add(weekdayName(cur));
                        cur.setDate(cur.getDate() + 1);
                      }
                    }

                    return (
                      <div className="flex flex-wrap gap-2">
                        {DAYS.map((day) => {
                          const selected = value.includes(day);
                          // For one-time projects, don't restrict by date range - allow any day to be selected
                          // For recurring projects, only restrict if we have a valid date range and it's within 7 days
                          const outOfRange = isOneTime
                            ? false
                            : duration > 0 && duration <= 7 && validSet.size > 0
                              ? !validSet.has(day)
                              : false;
                          // Disable based on repeatInterval (number of days per week)
                          const limitReached =
                            !selected &&
                            !isOneTime &&
                            repeatInterval > 0 &&
                            value.length >= repeatInterval;
                          // For one-time projects, only allow selecting one day
                          const oneTimeLimitReached =
                            isOneTime && !selected && value.length >= 1;
                          const disable =
                            outOfRange || limitReached || oneTimeLimitReached;
                          return (
                            <Button
                              key={day}
                              type="button"
                              variant={selected ? "default" : "outline"}
                              size="sm"
                              disabled={disable}
                              onClick={() => {
                                let next;
                                if (isOneTime) {
                                  // For one-time, replace the current selection with the new day
                                  next = selected ? [] : [day];
                                } else {
                                  // For recurring, toggle as usual
                                  next = selected
                                    ? value.filter((d) => d !== day)
                                    : [...value, day];
                                }
                                field.onChange(next);
                              }}
                              aria-pressed={selected}
                            >
                              {day}
                            </Button>
                          );
                        })}
                      </div>
                    );
                  }}
                />
                {errors.days_of_week && (
                  <p className="text-sm text-red-600">
                    {String(errors.days_of_week.message)}
                  </p>
                )}
              </div>
            }

            {/* Time window */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="time_start">Start Time</Label>
                <Input
                  id="time_start"
                  type="time"
                  step={300}
                  {...register("time_start", {
                    required: "Start time is required",
                  })}
                  aria-invalid={!!errors.time_start}
                  className="relative pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
                />
                {errors.time_start && (
                  <p className="text-sm text-red-600">
                    {errors.time_start.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_end">End Time</Label>
                <Input
                  id="time_end"
                  type="time"
                  step={300}
                  {...register("time_end", {
                    required: "End time is required",
                  })}
                  aria-invalid={!!errors.time_end}
                  className="relative pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
                />
                {errors.time_end && (
                  <p className="text-sm text-red-600">
                    {errors.time_end.message as string}
                  </p>
                )}
              </div>
            </div>

            <div
              className={`grid gap-4 ${repeatInterval !== 0 ? "sm:grid-cols-2" : ""}`}
            >
              {repeatInterval !== 0 && (
                <div className="space-y-2">
                  <Label htmlFor="slots">Total Slots</Label>
                  <Input
                    id="slots"
                    type="number"
                    min={1}
                    {...register("slots", {
                      required: "Slot count is required",
                      valueAsNumber: true,
                    })}
                    aria-invalid={!!errors.slots}
                  />
                  {errors.slots && (
                    <p className="text-sm text-red-600">
                      {errors.slots.message as string}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="commitable_hours">Total Service Hours</Label>
                <Input
                  id="commitable_hours"
                  type="number"
                  min={0}
                  {...register("commitable_hours", {
                    required: "Service hours are required",
                    valueAsNumber: true,
                    validate: (v) => {
                      const s = getValues("start_date");
                      const e = getValues("end_date");
                      const ts = getValues("time_start");
                      const te = getValues("time_end");
                      const ri = getValues("repeat_interval");
                      const per = perSessionHours(ts, te);
                      const matches = countMatchingDates(
                        s,
                        e,
                        getValues("days_of_week"),
                      );
                      const expected = matches * per;

                      if (Number.isFinite(expected) && expected > 0) {
                        if (Math.abs((v || 0) - expected) > 10)
                          return `Service hours too far from expected (${Math.round(expected)}h ±10h allowed)`;
                      }
                      return true;
                    },
                  })}
                  aria-invalid={!!errors.commitable_hours}
                />
                <p className="text-muted-foreground text-xs">
                  Expected: {expectedHours || "—"}h (±10h allowed)
                </p>
                {errors.commitable_hours && (
                  <p className="text-sm text-red-600">
                    {errors.commitable_hours.message as string}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ---------- MEDIA ---------- */}
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                placeholder="https://example.com/cover.jpg"
                {...register("image_url", {
                  required: "Feature image is required",
                })}
                aria-invalid={!!errors.image_url}
              />
              {errors.image_url && (
                <p className="text-sm text-red-600">
                  {errors.image_url.message as string}
                </p>
              )}
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="bg-muted/20 flex min-h-[200px] items-center justify-center rounded-lg border p-4">
                {watch("image_url") ? (
                  <img
                    src={watch("image_url")}
                    alt="Preview"
                    className="max-h-[300px] max-w-full rounded object-contain"
                  />
                ) : (
                  <div className="text-muted-foreground text-center">
                    <ImageIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p className="text-sm">No image uploaded</p>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                Recommended: Copy image address with landscape orientation,
                1920×1080px or higher
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ---------- PROJECT TAGS ---------- */}
        <Card>
          <CardHeader>
            <CardTitle>Project Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Choose the tags that best describe this project
            </p>
            <Controller
              control={control}
              name="project_tags"
              rules={{
                validate: (v) =>
                  (v?.length || 0) > 0 || "Select at least one project tag",
              }}
              render={({ field }) => (
                <TagsSelector
                  value={field.value || []}
                  onChange={(tags) => field.onChange(tags)}
                />
              )}
            />
            {errors.project_tags && (
              <p className="text-sm text-red-600">
                {errors.project_tags.message as string}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="mb-8 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => nav({ to: "/organisations/dashboard" })}
          >
            Cancel
          </Button>
          <Button type="submit">Continue to Preview</Button>
        </div>
      </form>
    </div>
  );
}

export default NewProjectPage;
