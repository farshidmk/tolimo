export type Exam = {
  sections: ExamSection[];
  examTitle: string;
  defaultDuration: string; // sample "03:30:00",
  bookletName: string;
  testType: number;
  bookletCode: string; //sample "B01",
  examId: string;
  accommodation: number;
  alignment: number;
  description: string;
  isEncrypted: boolean;
  sign: null;
};

export type ExamSection = {
  sectiontId: string;
  bookletCode: string;
  title: string;
  sectionType: number;
  displayOrder: number;
  sectionDuration: string; //"00:10:00",
  isForcedToAnswer: boolean;
  areAnswersEditable: true;
  minRequiredAnswers: 0;
  maxAllowedAnswers: 30;
  questions: SectionQuestion[];
  formObjects: SectionFormObject[];
  isEncrypted: false;
  sign: null;
  isRunning: boolean;
  timeLeft: number;
};

/**
 * نماینده یک سوال در یک دفترچه برای آزمون، شامل ویژگی‌های مختلف مرتبط با نمایش و رفتار سوال.
 */
export type SectionQuestion = {
  questionId: string;

  sectionId: string; // Guid در C# به عنوان string در TypeScript نمایندگی می‌شود.

  /**
   * ترتیب نمایش سوال در بخش.
   */
  displayOrder: number; // int در C# به عنوان number در TypeScript نمایندگی می‌شود.

  /**
   * اشیای فرم مرتبط با سوال (مثلاً دکمه‌ها، برچسب‌ها).
   * اگر خالی باشد، از بخش بالادست تبعیت می‌کند.
   */
  formObjects: FormObject[];

  /**
   * آیا هنگام نمایش این سوال، تایمر بخش متوقف شود؟
   */
  stopSectionTimer: boolean; // bool در C# به عنوان boolean در TypeScript نمایندگی می‌شود.

  /**
   * پس از چند ثانیه توقف، سوال بعدی به‌صورت خودکار نمایش داده شود.
   * اگر صفر باشد، منتظر تعامل کاربر می‌ماند.
   */
  nextAfterSeconds: number; // short در C# به عنوان number در TypeScript نمایندگی می‌شود.

  /**
   * نوع سوال (مثلاً چندگزینه‌ای، تشریحی، شنیداری...).
   */
  questionType: QuestionKind; // فرض بر این است که QuestionKind در جای دیگری تعریف شده است.

  /**
   * دستورالعمل کلی سوال برای نمایش به داوطلب.
   * می‌تواند خالی باشد.
   */
  direction: string; // string در C# به عنوان string در TypeScript نمایندگی می‌شود.

  /**
   * توضیحات یا اطلاعات تکمیلی برای داوطلب.
   * می‌تواند خالی باشد.
   */
  comments?: string[]; // فرض بر این است که Comment در جای دیگری تعریف شده است.
  // comments?: Comment[]; // فرض بر این است که Comment در جای دیگری تعریف شده است.

  /**
   * لیست گزینه‌های سوال (برای سوالات چندگزینه‌ای).
   * می‌تواند خالی باشد.
   */
  choiceList?: ChoiceList; // فرض بر این است که ChoiceList در جای دیگری تعریف شده است.

  /**
   * منابع وابسته به سوال (متن، تصویر، صوت).
   * متن اصلی سوال نیز در این لیست قرار می‌گیرد.
   * باید دارای مقدار باشد.
   */
  passages: Passage[];

  /**
   * آیا پاسخ دادن به این سوال اجباری است؟
   */
  isForcedToAnswer: boolean; // bool در C# به عنوان boolean در TypeScript نمایندگی می‌شود.

  /**
   * زمان اختصاصی برای مشاهده یا پاسخ‌دهی به سوال (بر حسب ثانیه).
   * می‌تواند صفر باشد.
   */
  questionTime: number; // short در C# به عنوان number در TypeScript نمایندگی می‌شود.

  /**
   * زمان اختصاصی برای مشاهده بدون پاسخ‌دهی به سوال (بر حسب ثانیه).
   * می‌تواند صفر باشد.
   * براس والاتی استفاده میشود که نیاز هست به دواطلب فرصت آمادگی داده شود. مانند سوالات گفتاری
   */
  waitingTime: number; // short در C# به عنوان number در TypeScript نمایندگی می‌شود.
};

/**
 * نماینده یک لیست گزینه برای انتخاب توسط داوطلب، شامل ویژگی‌های مختلف مرتبط با نمایش و رفتار گزینه‌ها.
 */
export type ChoiceList = {
  /**
   * آیا گزینه‌ها با تأخیر نمایش داده شوند؟
   * معمولاً در سوالات شنیداری برای جلوگیری از پیش‌نمایش استفاده می‌شود.
   */
  notShowImmediately: boolean;

  /**
   * لیست گزینه‌ها برای انتخاب توسط داوطلب.
   * می‌تواند شامل متن، تصویر، یا صوت باشد.
   */
  choices: Choice[];

  /**
   * نوع لیست گزینه‌ها (مثلاً تک‌گزینه‌ای، چندگزینه‌ای، Drag & Drop).
   * برای کنترل رفتار ارزیابی و نمایش.
   */
  // choiceMode: AnswerSelectionMode;

  /**
   * آیا گزینه‌ها باید به ترتیب مشخص‌شده نمایش داده شوند؟
   * اگر false باشد، ممکن است به‌صورت تصادفی یا بر اساس منطق دیگر مرتب شوند.
   */
  isOrdered: boolean;
};

/**
 * نماینده یک گزینه برای انتخاب در سوالات، شامل ویژگی‌های مختلف مرتبط با گزینه.
 */
export type Choice = {
  /**
   * شماره گزینه در پاسخ‌نامه.
   * برای ثبت پاسخ داوطلب و ارزیابی.
   */
  id: number;

  /**
   * متن نمایشی گزینه.
   * می‌تواند شامل متن، تصویر، یا صوت باشد.
   */
  text: string;

  /**
   * ترتیب نمایش گزینه.
   * اگر مقدار داشته باشد، گزینه‌ها بر اساس آن مرتب می‌شوند؛ در غیر این‌صورت به‌صورت تصادفی.
   */
  order: number;
};

/**
 * نماینده یک بخش برای سوالات، شامل ویژگی‌های مختلف مرتبط با محتوا و رفتار بخش.
 */
export type Passage = {
  /**
   * متن نمایشی همزمان با فایل.
   * می‌تواند خالی باشد (مثلاً در فایل‌های صوتی یا تصویری).
   */
  text: string;

  /**
   * لیست فایل‌های صوتی یا تصویری مرتبط با این بخش.
   * می‌تواند خالی باشد.
   */
  embeddedFiles: EmbeddedFile[];

  /**
   * نوع بخش (مثلاً سوال، راهنما، منبع).
   * اگر از نوع سوال باشد، باید دارای متن باشد.
   */
  passageType: PassageType;

  /**
   * ترتیب نمایش یا پخش این بخش در سوال.
   */
  displayOrder: number;

  /**
   * آیا هنگام پخش این بخش، زمان آزمون متوقف شود؟
   */
  isStopingTime: boolean;

  /**
   * اطلاعات اضافی مرتبط با این بخش (مثلاً تنظیمات صوت، زیرنویس...).
   */
  // properties: PassageProperties;
};

/**
 * نماینده یک فایل جاسازی شده، شامل ویژگی‌های مختلف مرتبط با محتوا و رفتار فایل.
 */
export type EmbeddedFile = {
  /**
   * نام فایل برای نمایش یا ذخیره‌سازی.
   */
  fileName: string; // string در C# به عنوان string در TypeScript نمایندگی می‌شود.

  /**
   * نوع فایل (مثلاً صوت، تصویر، ویدئو).
   * برای کنترل رفتار پخش و رندر.
   */
  fileType: FileType;

  /**
   * طول مدت پخش فایل به ثانیه. اگر صفر باشد، کل فایل پخش شود.
   */
  durationSeconds: number; // short در C# به عنوان number در TypeScript نمایندگی می‌شود.

  /**
   * از چه زمانی از فایل پخش شود به ثانیه.
   */
  startSeconds: number; // short در C# به عنوان number در TypeScript نمایندگی می‌شود.

  /**
   * اشیای فرم مرتبط با این فایل (مثلاً دکمه‌ها، برچسب‌ها).
   * برای تعامل یا نمایش همزمان با فایل.
   */
  // formObjects: FormObject[];
};

/**
 * نوع فایل تعبیه‌شده در سوال یا بخش آزمون.
 * مشخص‌کننده رسانه مورد استفاده برای نمایش، پخش، یا تعامل.
 */
export enum FileType {
  /**
   * فایل صوتی (مثلاً MP3، WAV).
   * برای پخش شنیداری در سوالات Listening یا Speaking.
   */
  Voice = 1,

  /**
   * فایل تصویری (مثلاً PNG، JPG).
   * برای نمایش در سوالات تصویری یا منابع دیداری.
   */
  Image = 2,

  /**
   * فایل متنی ساده (مثلاً TXT).
   * برای نمایش مستقیم متن بدون قالب‌بندی.
   */
  Text = 3,

  /**
   * فایل متنی قالب‌دار (RTF).
   * برای نمایش متن با قالب‌بندی، فونت، رنگ و ساختار.
   */
  Rtf = 4,

  /**
   * فایل ویدئویی (مثلاً MP4، WebM).
   * برای پخش تصویری در سوالات چندرسانه‌ای.
   */
  Video = 5,

  /**
   * فایل PDF.
   * برای نمایش اسناد رسمی، منابع یا دستورالعمل‌ها.
   */
  Pdf = 6,

  /**
   * قطعه HTML.
   * برای نمایش محتوای تعاملی یا قالب‌دار در مرورگر داخلی.
   */
  HtmlFragment = 7,
}

/**
 * نوع بخش در سوالات، مشخص‌کننده نوع محتوا و رفتار آن.
 */
export enum PassageType {
  /**
   * قسمتی از سوال است بدون دیده شدن سوال، پخش میشود (متن، تصویر یا صوت)
   * معمولاً برای تصویر و صوت به کار می‌رود.
   */
  Lecture = 0,

  /**
   * خود سوال است.
   */
  Question = 1,

  /**
   * قسمتی از سوال است. نباید در صفحه تغییر وضعیت داد.
   */
  StopMedia = 2,

  /**
   * بخش درک مطلب یا Reading.
   * معمولاً شامل متن طولانی برای تحلیل یا پاسخ‌دهی.
   */
  Reading = 3,
}

export type SectionFormObject = {
  state: number;
  label: string;
  formObjectType: number;
  isEncrypted: boolean;
  sign: unknown;
};
