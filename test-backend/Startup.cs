namespace test_backend
{
    using System.Collections.Generic;
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.IdentityModel.Tokens;

    public sealed class Startup
    {
        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Authority = $"https://login.microsoftonline.com/{this.Configuration["AzureAd:Authority"]}";
                    options.Audience = this.Configuration["AzureAd:Audience"];
                    options.RequireHttpsMetadata = false;
                    options.IncludeErrorDetails = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidIssuers = new List<string>
                        {
                            $"https://sts.windows.net/{this.Configuration["AzureAd:Authority"]}/",
                            $"https://login.microsoftonline.com/{this.Configuration["AzureAd:Authority"]}"
                        }
                    };
                });

            services.AddControllers();
            services.AddApplicationInsightsTelemetry();
        }
    }
}