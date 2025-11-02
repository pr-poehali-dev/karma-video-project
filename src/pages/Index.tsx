import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [isListening, setIsListening] = useState(false);
  const [aiHelperOpen, setAiHelperOpen] = useState(false);

  const sidebarItems = [
    { id: 'bookmarks', icon: 'Bookmark', label: 'Закладки', count: 12 },
    { id: 'history', icon: 'History', label: 'История', count: 234 },
    { id: 'favorites', icon: 'Star', label: 'Избранное', count: 8 },
    { id: 'extensions', icon: 'Puzzle', label: 'Расширения', count: 5 },
    { id: 'notifications', icon: 'Bell', label: 'Уведомления', count: 3 },
    { id: 'settings', icon: 'Settings', label: 'Настройки', count: 0 },
  ];

  const quickSearchModes = [
    { id: 'text', icon: 'Search', label: 'Текст' },
    { id: 'voice', icon: 'Mic', label: 'Голос' },
    { id: 'image', icon: 'Image', label: 'Фото' },
    { id: 'music', icon: 'Music', label: 'Музыка' },
  ];

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
  };

  const aiTips = [
    { title: 'Как искать голосом?', tip: 'Нажми на иконку микрофона и произнеси свой запрос' },
    { title: 'Поиск по фото', tip: 'Загрузи изображение, чтобы найти похожие картинки или информацию' },
    { title: 'Найди музыку', tip: 'Опиши песню словами: настроение, жанр или часть текста' },
    { title: 'Горячие клавиши', tip: 'Ctrl+K для быстрого поиска, Ctrl+B для закладок' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-20 lg:w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 lg:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={24} className="text-primary-foreground" />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-foreground">SearchPro</h1>
              <p className="text-xs text-muted-foreground">Браузер будущего</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-2 lg:p-4">
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-accent"
              onClick={() => setActiveSection('home')}
            >
              <Icon name="Home" size={20} />
              <span className="hidden lg:inline">Главная</span>
            </Button>
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start gap-3 hover:bg-accent"
                onClick={() => setActiveSection(item.id)}
              >
                <Icon name={item.icon as any} size={20} />
                <span className="hidden lg:inline">{item.label}</span>
                {item.count > 0 && (
                  <Badge variant="secondary" className="ml-auto hidden lg:flex">
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-2 lg:p-4 border-t border-border">
          <Sheet open={aiHelperOpen} onOpenChange={setAiHelperOpen}>
            <SheetTrigger asChild>
              <Button
                variant="default"
                className="w-full gap-2 bg-primary hover:bg-primary/90"
              >
                <Icon name="Sparkles" size={20} />
                <span className="hidden lg:inline">ИИ Помощник</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Icon name="Sparkles" size={24} className="text-primary" />
                  ИИ Помощник
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Я помогу тебе освоить все возможности браузера! Вот несколько полезных советов:
                </p>
                <div className="space-y-3">
                  {aiTips.map((item, idx) => (
                    <Card key={idx} className="p-4 bg-muted hover:bg-accent transition-colors cursor-pointer">
                      <h4 className="font-semibold text-sm mb-2 text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.tip}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="border-b border-border bg-card p-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Icon
                name="Search"
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="Поиск в интернете..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-40 h-14 text-lg bg-background border-border"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <Button
                  size="icon"
                  variant={isListening ? 'default' : 'ghost'}
                  onClick={handleVoiceSearch}
                  className="h-10 w-10"
                >
                  <Icon name="Mic" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="h-10 w-10">
                  <Icon name="Image" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="h-10 w-10">
                  <Icon name="Music" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {activeSection === 'home' && (
            <div className="max-w-6xl mx-auto p-6 space-y-8">
              <div className="text-center space-y-4 py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                  <Icon name="Zap" size={40} className="text-primary" />
                </div>
                <h2 className="text-4xl font-bold text-foreground">
                  Добро пожаловать в SearchPro
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Мощный браузер с ИИ-поиском, голосовым управлением и поиском музыки
                </p>
              </div>

              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
                  {quickSearchModes.map((mode) => (
                    <TabsTrigger key={mode.id} value={mode.id} className="gap-2">
                      <Icon name={mode.icon as any} size={18} />
                      <span className="hidden sm:inline">{mode.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="text" className="mt-8">
                  <Card className="p-8 max-w-2xl mx-auto">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Текстовый поиск</h3>
                    <p className="text-muted-foreground mb-6">
                      Используй поисковую строку выше для быстрого поиска информации
                    </p>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">Популярные запросы:</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Новости', 'Погода', 'Курс валют', 'Спорт', 'Технологии'].map((tag) => (
                          <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-accent">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="voice" className="mt-8">
                  <Card className="p-8 max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-6">
                      <Icon name="Mic" size={48} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Голосовой поиск</h3>
                    <p className="text-muted-foreground mb-6">
                      Нажми на кнопку микрофона и произнеси свой запрос
                    </p>
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                      onClick={handleVoiceSearch}
                    >
                      {isListening ? 'Остановить запись' : 'Начать запись'}
                    </Button>
                  </Card>
                </TabsContent>

                <TabsContent value="image" className="mt-8">
                  <Card className="p-8 max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-secondary/10 rounded-full mb-6">
                      <Icon name="Image" size={48} className="text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Поиск по фото</h3>
                    <p className="text-muted-foreground mb-6">
                      Загрузи изображение, чтобы найти похожие картинки или информацию
                    </p>
                    <Button size="lg" variant="secondary">
                      <Icon name="Upload" size={20} className="mr-2" />
                      Загрузить фото
                    </Button>
                  </Card>
                </TabsContent>

                <TabsContent value="music" className="mt-8">
                  <Card className="p-8 max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                        <Icon name="Music" size={32} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">Поиск музыки</h3>
                        <p className="text-sm text-muted-foreground">
                          Найди песню по описанию или настроению
                        </p>
                      </div>
                    </div>
                    <Input
                      placeholder="Например: энергичная рок-музыка 90-х"
                      className="mb-4"
                    />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">Примеры запросов:</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Грустная музыка', 'Танцевальные хиты', 'Джаз', 'Рок 80-х', 'Поп'].map((tag) => (
                          <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-accent">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeSection === 'bookmarks' && (
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Закладки</h2>
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4 hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Globe" size={24} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Сохраненная страница {i}</h3>
                        <p className="text-sm text-muted-foreground">example{i}.com</p>
                      </div>
                      <Icon name="Star" size={20} className="text-primary" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'history' && (
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-foreground">История</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Сегодня</h3>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
                        <Icon name="Clock" size={16} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">Посещенная страница {i}</span>
                        <span className="text-xs text-muted-foreground ml-auto">14:3{i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'favorites' && (
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Избранное</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-6 text-center hover:bg-accent transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Icon name="Star" size={32} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm text-foreground">Сайт {i}</h3>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Настройки</h2>
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 text-foreground">Общие настройки</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Темная тема</span>
                      <Button variant="outline" size="sm">Вкл</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Уведомления</span>
                      <Button variant="outline" size="sm">Вкл</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
